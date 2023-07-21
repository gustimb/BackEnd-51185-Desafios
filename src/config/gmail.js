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

export { transporter };
export { emailTemplate };