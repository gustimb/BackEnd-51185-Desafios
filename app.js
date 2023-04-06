import express from 'express';
import ProductManager from './src/manager/ProductManager.js';

const PORT = 8080;

const AgregaProductos = new ProductManager();
const app = express();

app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.get('/products', async (req, res) => {
    const productos = await AgregaProductos.getProducts();
    res.send(productos);
})

app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const producto = await AgregaProductos.getProductById(id);
    res.send(producto);
})

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const msg = await AgregaProductos.deleteProduct(id);
    res.send(msg);
})


app.get('/limitquery', async (req, res) => {

    const limit = req.query.limit;
    const productos = await AgregaProductos.getProducts();

    if (!limit) {
        res.send(productos);
    } else {
        const productLimit = productos.slice(0, limit)
        res.send(productLimit);
    }
})

app.get('/newquery', async (req, res) => {

    const { title, description, price, thumbnail, code, stock } = req.query;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
        res.send('Faltan datos')
        return
    }
    const product = {
        title, description, price, thumbnail, code, stock
    }
    const msg = await AgregaProductos.addProduct(product);
    res.send(msg);
})

app.get('/editquery', async (req, res) => {

    const { id, title, description, price, thumbnail, code, stock } = req.query;

    if (!id || !title || !description || !price || !thumbnail || !code || !stock) {
        res.send('Faltan datos')
        return
    }

    const msg = await AgregaProductos.updateProduct(id, title, description, price, thumbnail, code, stock);
    res.send(msg);
})


