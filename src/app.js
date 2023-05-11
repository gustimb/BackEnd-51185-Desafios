import express, { json } from 'express';
import mongoose from 'mongoose';
import handlerbars from 'express-handlebars';
import { Server } from 'socket.io';


import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';
import ProductManager from './Dao/managers/ProductManager.js';
import productsModel from "./Dao/models/products.js";
import chatModel from "./Dao/models/chat.js";

const PORT = 8080;
const MONGO = 'mongodb+srv://gmb92:NZ5x3BzUhBIzjVnV@gmbcluster0.4il3ee1.mongodb.net/'
const app = express();

const connection = mongoose.connect(MONGO);
const productManager = new ProductManager();

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
// const products = await productManager.getProducts();
const products = await productsModel.find();
const ShowAllProducts = products.map(e => `<p>ID de producto: ${e._id} </p> <p>Nombre ded producto: ${e.title} </p> <p>Descripción del producto: ${e.description}</p> <p>Código del producto: ${e.code} </p> <p>Precio del producto: ${e.price} </p> <p>Estatus del producto: ${e.status} </p> <p>Stock del producto: ${e.stock} </p> <p>Categoría del producto: ${e.category} </p>`)

socketServerIO.on('connection', socket => {
    console.log('Cliente conectado');
    socketServerIO.emit('showAllProducts', ShowAllProducts.join("<hr>"))

    socket.on("newProduct", async (data) => {
        const product = data
        // await productManager.addProduct(product);
        await productsModel.create(product);
    })

    socket.on("deleteProduct", async (data) => {
        const pid = data
        // await productManager.deleteProduct(id);
        await productsModel.deleteOne({ _id: pid });

    })




    socket.on("message", async (data) => {



        const logs = { user: socket.id, message: data }
        
        await chatModel.create(logs);

        const historyChat = await chatModel.find();

        console.log(historyChat)

        socketServerIO.emit('log', historyChat)
    })

});







