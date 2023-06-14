import passport from 'passport';
import local from 'passport-local';
import userModel from '../Dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import CartManagerDB from "../Dao/managers/DB/cartManagerDB.js";

const LocalStrategy = local.Strategy;
const cartManagerDB = new CartManagerDB();

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;


            try {
                const user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('El usuario existe');
                    return done(null, false);
                }

                const cart = await cartManagerDB.addCart();
                console.log(cart)

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: cart._id
                }

                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (!user) {
                console.log('No existe el usuario');
                return done(null, false);
            }

            if (!validatePassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user)
    });

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.0a114f787afb1d03',
        clientSecret: '20b15f3f53300f2d46b3d291e16cc2094abc6236',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async (accesToken, refreshToken, profile, done) => {
        try {

            // console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {

                const email = profile._json.email || "Private mail"

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    age: 18,
                    password: '',
                }
                const result = await userModel.create(newUser);
                done(null, result)
            } else {
                done(null, user)
            }

        } catch (error) {
            return done(null, error)
        }
    }))
}

export default initializePassport;