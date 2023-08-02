import nodemailer from "nodemailer";
import { options } from "./options.js";

const adminEmail = options.gmail.adminAccount;
const adminPass = options.gmail.adminPass;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

const emailTemplate = `<div>
<h1>Registro exitoso!!</h1>
<p>Ya puedes empezar a usar nuestros servicios</p>
</div>`;

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`;
    await transporter.sendMail({
        from: options.gmail.adminAccount,
        to: userEmail,
        subject: `Restablecer contraseña: ${userEmail}`,
        html: `
        <div>
        <h2>Has solicitado restablecer tu contraseña.</h2>
        <p>Da clic en el siguiente enlace para restablecerla:</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })
};

export { transporter };
export { emailTemplate };