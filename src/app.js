import express, { json } from 'express';
import mongoose from 'mongoose';
import handlerbars from 'express-handlebars';
import { Server } from 'socket.io';

import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import productsModel from "./Dao/models/products.js";
import chatModel from "./Dao/models/chat.js";

const PORT = 8080;
const MONGO = 'mongodb+srv://gmb92:NZ5x3BzUhBIzjVnV@gmbcluster0.4il3ee1.mongodb.net/'
const app = express();

const connection = mongoose.connect(MONGO);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlerbars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use('/', viewRouter);

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
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







