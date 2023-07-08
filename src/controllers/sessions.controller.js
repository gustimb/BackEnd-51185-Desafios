import SessionsService from "../services/sessions.service.js";
import passport from 'passport';
import { createHash, validatePassword } from '../utils.js';


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

    restartPassword = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "Datos incorrectos" });

        const user = await sessionsService.getUserByMail(email);

        if (!user) return res.status(400).send({ status: "error", error: "Datos incorrectos" });

        const newHashedPassword = createHash(password);
        const uid = user._id;

        sessionsService.updateUserPass(uid, newHashedPassword);
        res.send({ status: "success", message: "Contraseña actualizada" });
    };

    current = async (req, res) => {
        const uid = req.user._id;
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


