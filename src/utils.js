import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { Faker, en } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { options } from "./config/options.js";

export const customFaker = new Faker({
    locale: [en]
});

const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

export const generateFakerProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        code: string.alphanumeric(10),
        price: parseFloat(commerce.price()),
        status: "ok",
        stock: parseInt(string.numeric(2)),
        category: commerce.department(),
        thumbnail: image.url()
    };
};

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, options.gmail.emailToken, { expiresIn: expireTime });
    return token;
};

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, options.gmail.emailToken);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    };
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;