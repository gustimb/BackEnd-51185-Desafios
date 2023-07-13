import dotenv from "dotenv";

dotenv.config();

export const options = {
    fileSystem: {
        usersFileName: 'users.json',
        productsFileName: 'products.json',
    },
    mongoDB: {
        url: process.env.MONGO_URL
    },
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION
    },
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    gmail:{
        adminAccount: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASS
    }
};