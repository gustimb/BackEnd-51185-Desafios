import { Router } from 'express';
import SessionsController from "../controllers/sessions.controller.js";
import passport from 'passport';
import { uploaderProfile } from '../middlewares/validations.js';

const router = Router();
const sessionsController = new SessionsController();

router.post('/register',
    // sessionsController.register
    uploaderProfile.single('avatar'),
    passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
        req.logger.info(`Usuario registrado: ${req.user.email}`)
        res.send({ status: "success", payload: req.user, message: "User registered" });
    }
);

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role
    };
    req.logger.info(`Usuario logueado: ${req.user.email}`)
    res.send({ status: "success", payload: req.user, message: "Logueo correcto." });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/faillogin', sessionsController.faillogin);

router.get('/failregister', sessionsController.failregister);

router.get('/logout', sessionsController.logout);

router.get('/current', sessionsController.current);

router.post("/forgot-password", sessionsController.forgotPassword);

router.post("/reset-password", sessionsController.resetPassword);

export default router;