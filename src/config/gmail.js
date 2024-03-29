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

const deletedAccTemplate = `<div>
<h1>Tu cuenta fue eliminada</h1>
<p>Tomamos esta medida debido al tiempo de inactividad en nuestra plataforma.</p>
<p>Si así lo deseas, puedes registrarte nuevamente.</p>
<p>Saludos!</p>
</div>`;

const deletedProductTemplate = `<div>
<h1>Tu producto fue eliminado</h1>
<p>Ya no forma parte de los productos disponibles de tu tienda.</p>
<p>Si así lo deseas, puedes cargarlo nuevamente.</p>
<p>Saludos!</p>
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
export { deletedAccTemplate };
export { deletedProductTemplate };