import { Router } from 'express';
import userModel from '../Dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
})

router.get('/failregister', async (req, res) => {
    console.log('Fallo en el registro');
    res.send({ error: 'Error en el registro' })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: 'Invalid credentials' });

    const role = req.user.email == 'adminCoder@coder.com' ? true : [];

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: `${role}`
    }
    res.send({ status: "success", payload: req.user, message: "Logueo correcto." })
})

router.get('/faillogin', async (req, res) => {
    res.send({ error: 'Error en el ingreso' })
    console.log('Fallo en el ingreso');
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" })
        res.redirect('/login');
    })
})

router.post('/restartPassword', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ status: "error", error: "Datos incorrectos" })

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Datos incorrectos" })

    const newHashedPassword = createHash(password);

    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

    res.send({ status: "success", message: "Contraseña actualizada" })
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products')
})

export default router;