import { Router } from "express";
import ProductManager from '../Dao/managers/ProductManager.js';
import ManagerAccess from '../Dao/managers/ManagerAccess.js';
import productsModel from "../Dao/models/products.js";


const router = Router();
const AgregaProductos = new ProductManager();
const managerAccess = new ManagerAccess();


// GET TODOS LOS PRODUCTOS

router.get('/', async (req, res) => {
    const result = await productsModel.find();
    res.send(result);
    await managerAccess.crearRegistro('Consulta productos')
    // const productos = await AgregaProductos.getProducts();
    // res.send(productos);
})

// GET PRODUCTOS CON LIMITE

router.get('/limitquery', async (req, res) => {
    const limit = req.query.limit;
    const productos = await productsModel.find();
    // const productos = await AgregaProductos.getProducts();

    if (!limit) {
        res.send(productos);
    } else {
        const productLimit = productos.slice(0, limit)
        res.send(productLimit);
        await managerAccess.crearRegistro(`Productos con límite de vista: ${limit}`)
    }
})

// GET PRODUCTO POR ID

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const producto = await productsModel.find({ _id: pid });
    // const producto = await AgregaProductos.getProductById(pid);
    res.send(producto);
    await managerAccess.crearRegistro(`Consulta producto por ID: ${pid}`)
})

// POST AGREGAR PRODUCTO

router.post('/', async (req, res) => {

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.status(400).send({
            error: 'Faltan datos'
        })
        return
    }

    const product = {
        title, description, code, price, status, stock, category, thumbnail
    }

    const result = await productsModel.create(product)
    res.send(result);

    await managerAccess.crearRegistro('Se agregó producto con éxito')

    // const msg = await AgregaProductos.addProduct(product);
    // res.send(msg);
})

// PUT ACTUALIZAR PRODUCTO

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.send('Faltan datos')
        return
    }

    const msg = await productsModel.updateOne({ _id: pid }, { $set: { title, description, code, price, status, stock, category, thumbnail } });
    // const msg = await AgregaProductos.updateProduct(pid, title, description, code, price, status, stock, category, thumbnail);
    res.send(msg);
    await managerAccess.crearRegistro(`Se ha actualizado el producto con ID: ${pid}`)
})

// DELETE BORRAR PRODUCTO

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const msg = await productsModel.deleteOne({ _id: pid });
    // const msg = await AgregaProductos.deleteProduct(pid);
    res.send(msg);
    await managerAccess.crearRegistro(`Se ha eliminado el producto con ID: ${pid}`)
})

export default router;



