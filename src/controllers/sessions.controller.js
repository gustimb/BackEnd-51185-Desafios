import SessionsService from "../services/sessions.service.js";
import passport from 'passport';
import { createHash, validatePassword, generateEmailToken, verifyEmailToken } from '../utils.js';
import { sendRecoveryPass } from "../config/gmail.js";


const sessionsService = new SessionsService();

export default class SessionsController {

    ChangeUserRole = async (req, res) => {

        const uid = req.params.uid;

        try {
            let user = await sessionsService.getUserById(uid);

            if (!user) {
                req.logger.error(`No se ubica el usuario ${uid}`);
                return res.status(400).json({ message: `No se ubica el usuario ${uid}` });
            };

            user.documents.length === 3 ? user.status = "completo" : user.status = "incompleto"

            if (user.role === "user" && user.status != "completo") {
                req.logger.error(`el usuario no ha terminado de procesar su documentación`);
                return res.json({ status: "error", message: `el usuario no ha terminado de procesar su documentación` });
            }

            console.log(user.role === "user" && user.status === "completo")

            if (user.role === "user" && user.status === "completo") {
                user.role = "premium";
            } else if (user.role === "premium") {
                user.role = "user";
            } else {
                req.logger.error(`No es posible cambiar el rol del usuario`);
                return res.json({ status: "error", message: `No es posible cambiar el rol del usuario` });
            };

            await sessionsService.userUpdateOne({ _id: user._id }, user);
            req.logger.info(`Rol de usuario modificado con éxito a << ${user.role} >>`);
            res.send({ status: "success", message: `Rol de usuario modificado con éxito a << ${user.role} >>` });
        } catch (error) {
            req.logger.error(`Hubo un error al cambiar el rol del usuario`);
            res.json({ status: "error", message: `Hubo un error al cambiar el rol del usuario` });
        };
    };

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
        const user = await sessionsService.getUserByIdDTO(uid);
        res.send(user);
    };

    logout = (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send({ status: "error", error: "No pudo cerrar sesion" });
            res.redirect('/login');
        });
    };

    deleteUserById = async (req, res) => {

        const uid = req.params.uid;

        try {
            const user = await sessionsService.getUserById(uid);

            if (!user) {
                req.logger.error(`No se ubica el usuario ${uid}`);
                return res.status(400).json({ message: `No se ubica el usuario ${uid}` });
            };

            if (req.user.role === "admin" || req.user._id == uid) {
                await sessionsService.deleteUserById(uid);
                return res.status(200).json({ message: `Usuario ID ${uid} eliminado` });
            }
            else {
                return res.status(400).json({ message: `No cuentas con permiso para eliminar al usuario ${uid}` });
            }
        } catch (error) {
            req.logger.error(`Hubo un error al eliminar el usuario`);
            res.json({ status: "error", message: `Hubo un error al eliminar el usuario` });
        };
    };

    updateUserDocument = async (req, res) => {
        try {
            const uid = req.params.uid
            const user = await sessionsService.getUserById(uid);

            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;

            const docs = [];

            if (identificacion) {
                docs.push({ name: "identificacion", reference: identificacion.filename })
            }
            if (domicilio) {
                docs.push({ name: "domicilio", reference: domicilio.filename })
            }
            if (estadoDeCuenta) {
                docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename })
            }
            if (docs.length === 3) {
                user.status = "completo"
            } else {
                user.status = "incompleto"
            }

            user.documents = docs;
            await sessionsService.userUpdateOne({ _id: user._id }, user)
            res.json({ status: "success", message: "Documentos actualizados" })
        } catch (error) {
            console.log(error.message);
            res.json({ status: "error", message: "Hubo un error en la carga de los archivos." })
        }
    }
};


