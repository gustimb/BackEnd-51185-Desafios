import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { Faker, en } from "@faker-js/faker";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;