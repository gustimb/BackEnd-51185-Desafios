import express, { json } from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import handlerbars from 'express-handlebars';
import passport from 'passport';
import { Server } from 'socket.io';


import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import sessionRouter from './routes/sessions.router.js';
import initializePassport from './config/passport.config.js';
import productsModel from "./Dao/models/products.js";
import chatModel from "./Dao/models/chat.js";
import { options } from "./config/options.js";
import { errorHandler } from './middlewares/errorHandler.js';
import { addLogger } from "./middlewares/logger.js";
import {logger} from "./middlewares/logger.js"

const currentEnv = options.nodeEnv.env;
const PORT = options.server.port;
const DB = 'ecommerce';

const MONGO = options.mongoDB.url + DB;
const app = express();

const connection = mongoose.connect(MONGO);

app.use(addLogger);

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: options.server.secretSession,
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlerbars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use('/', viewRouter);

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/session', sessionRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
    logger.info(`Servidor funcionando en el puerto ${PORT}`)
    logger.info(`El proyecto se está ejecutando en el entorno: ${currentEnv}`)
})

const socketServerIO = new Server(server);

socketServerIO.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on("newProduct", async (data) => {
        const product = data
        await productsModel.create(product);
    })

    socket.on("deleteProduct", async (data) => {
        const pid = data
        await productsModel.deleteOne({ _id: pid });
    })

    socket.on("message", async (data) => {
        const logs = { user: data[0], message: data[1] }
        await chatModel.create(logs);
        const historyChat = await chatModel.find();
        socketServerIO.emit('log', historyChat)
    })
});







