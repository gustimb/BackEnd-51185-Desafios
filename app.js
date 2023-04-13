import express, { json } from 'express';
import productRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);


