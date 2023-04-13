import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router();
const AgregaProductos = new ProductManager();

router.get('/', async (req, res) => {
    const productos = await AgregaProductos.getProducts();
    res.send(productos);
})

router.get('/limitquery', async (req, res) => {
    const limit = req.query.limit;
    const productos = await AgregaProductos.getProducts();

    if (!limit) {
        res.send(productos);
    } else {
        const productLimit = productos.slice(0, limit)
        res.send(productLimit);
    }
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const producto = await AgregaProductos.getProductById(pid);
    res.send(producto);
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.send('Faltan datos')
        return
    }
    const product = {
        title, description, code, price, status, stock, category, thumbnail
    }
    const msg = await AgregaProductos.addProduct(product);
    res.send(msg);
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.send('Faltan datos')
        return
    }

    const msg = await AgregaProductos.updateProduct(pid, title, description, code, price, status, stock, category, thumbnail);
    res.send(msg);
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const msg = await AgregaProductos.deleteProduct(pid);
    res.send(msg);
})

export default router;



