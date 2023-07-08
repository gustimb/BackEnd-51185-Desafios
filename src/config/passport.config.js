import passport from 'passport';
import local from 'passport-local';
import userModel from '../Dao/models/User.model.js';
import CartsDaoMongo from '../persistence/carts.dao.mongo.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import { options } from "./options.js";
import { transporter } from '../config/gmail.js';
import { emailTemplate } from '../config/gmail.js';
import e from 'express';

const LocalStrategy = local.Strategy;
const cartsDaoMongo = new CartsDaoMongo()

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

                const cart = await cartsDaoMongo.addCart();

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: cart
                }
                console.log(newUser);

                const result = await userModel.create(newUser);

                if (newUser.email) {
                    const contenido = await transporter.sendMail({
                        from: "GMB App",
                        to: newUser.email,
                        subject: "Registro exitoso",
                        html: emailTemplate
                    })
                    console.log("contenido", contenido)
                }
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
        clientID: options.github.clientID,
        clientSecret: options.github.clientSecret,
        callbackURL: options.github.callbackURL

    }, async (accesToken, refreshToken, profile, done) => {
        try {

            // console.log(profile);
            let user = await userModel.findOne({ githubID: profile._json.id })

            if (user)
                console.log('El usuario ya está registrado.')

            if (!user) {

                const email = profile._json.email || "Private mail"

                const cart = await cartsDaoMongo.addCart();

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    age: 18,
                    password: '',
                    cart: cart,
                    githubID: profile._json.id
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