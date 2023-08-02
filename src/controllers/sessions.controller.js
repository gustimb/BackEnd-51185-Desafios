import SessionsService from "../services/sessions.service.js";
import passport from 'passport';
import { createHash, validatePassword, generateEmailToken, verifyEmailToken } from '../utils.js';
import { sendRecoveryPass } from "../config/gmail.js";


const sessionsService = new SessionsService();

export default class SessionsController {

    register = (passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
        res.send({ status: "success", message: "User registered" });
    });

    failregister = async (req, res) => {
        console.log('Fallo en el registro');
        res.send({ error: 'Error en el registro' });
    };

    faillogin = async (req, res) => {
        res.send({ error: 'Error en el ingreso' });
        console.log('Fallo en el ingreso');
    };

    forgotPassword = async (req, res) => {
        const { email } = req.body;
        try {
            const user = await sessionsService.getUserByMail(email);
            if (!user) {
                return res.send(`<div>Ups! Hubo un error: <a href="/forgot-password">Intente de nuevo</a></div>`);
            };
            const token = generateEmailToken(email, '1h');
            await sendRecoveryPass(email, token);
            res.send("Se envio un correo a su cuenta para restablecer la contraseña, volver al <a href='/login'>login</a>");
        } catch (error) {
            return res.send(`<div>Ups! Hubo un error: <a href="/forgot-password">Intente de nuevo</a></div>`)
        };
    };


    resetPassword = async (req, res) => {
        const token = req.query.token;
        const { email, newPassword } = req.body;

        try {
            const validEmail = verifyEmailToken(token);
            if (!validEmail) {
                return res.send(`El enlace ya no es valido, genere uno <a href="/forgot-password">nuevo</a>.`);
            };
            const user = await sessionsService.getUserByMail(email);
            if (!user) {
                return res.send(`<div>El usuario no esta registrado.</div>
                <div><a href="/login">Inténtalo de nuevo</a></div>`)
            };
            if (validatePassword(newPassword, user)) {
                return res.send(`<div>No puedes usar la misma contraseña.</div>
                <div><a href="/login">Inténtalo de nuevo</a></div>`)
            };

            const newHashedPassword = createHash(newPassword);
            const uid = user._id;

            sessionsService.updateUserPass(uid, newHashedPassword);
            res.send(`<div> Contraseña actualizada con éxito.</div>
            <div><a href="/login">Inicia sesión</a></div>`)
        } catch (error) {
            res.send(error.message)
        }
    }

    current = async (req, res) => {

        if (!req.user) {
            res.json({ status: "error", message: "No hay usuario en sesión." });
            console.log("No hay usuario en sesión.");
            return;
        };

        const uid = req.user._id;
        console.log(uid);
        const user = await sessionsService.getUserById(uid);
        res.send(user);
    };

    logout = (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" });
            res.redirect('/login');
        });
    };
};


