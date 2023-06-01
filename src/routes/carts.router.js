import { Router } from "express";
import ManagerAccess from '../Dao/managers/fileSystem/ManagerAccess.js';
import cartsModel from "../Dao/models/carts.js";
import productsModel from "../Dao/models/products.js";

const router = Router();
const managerAccess = new ManagerAccess();

// GET TODOS LOS CARRITOS

router.get('/', async (req, res) => {
    const carts = await cartsModel.find();
    res.send(carts);
    await managerAccess.crearRegistro('Consulta carritos')
})

// POST CARRITO

router.post('/', async (req, res) => {

    const { products } = req.body;

    if (!products) {
        res.send('Faltan datos')
        return
    }

    const cart = { products }
    const msg = await cartsModel.create(cart);
    res.send(msg);

    await managerAccess.crearRegistro('Se creó carrito con éxito')
})

// GET CARRITO POR ID CON POPULATE

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsModel.findOne({ _id: cid }).populate('products._id');
    res.send(cart);
    await managerAccess.crearRegistro('Carrito por ID')
})


// POST AGREGAR AL CARRITO

router.post('/:cid/product/:pid', async (req, res) => {

    const pid = req.params.pid;
    const cid = req.params.cid;

    const cart = await cartsModel.findOne({ _id: cid });
    const product = await productsModel.findOne({ _id: pid })
    const productIndex = cart.products.findIndex(prod => prod._id == pid)

    if (cart.products.length < 1 || productIndex == -1) {
        await cart.products.push({ _id: product._id, quantity: 1 });
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        res.send(msg);
        await managerAccess.crearRegistro('Producto agregado al carrito')
        return
    }

    if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity) {
        let quantity = cart.products[productIndex].quantity + 1
        cart.products[productIndex].quantity = quantity
        try {
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro('Producto agregado al carrito')
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    } else {
        try {
            await cart.products.push({ _id: product._id, quantity: 1 });
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro('Producto agregado al carrito')
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    }
})

// BORRAR DEL CARRITO

router.delete('/:cid/product/:pid', async (req, res) => {

    const pid = req.params.pid;
    const cid = req.params.cid;

    const cart = await cartsModel.findOne({ _id: cid });
    const product = await productsModel.findOne({ _id: pid })
    const productIndex = cart.products.findIndex(prod => prod._id == pid)

    if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity > 1) {
        let quantity = cart.products[productIndex].quantity - 1
        cart.products[productIndex].quantity = quantity
        try {
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro('Producto quitado del carrito')
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    } else {
        try {
            await cart.products.splice(productIndex, 1);
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro('Producto eliminado del carrito')
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    }
})

// PUT SUMAR CANTIDAD

router.put('/:cid/product/:pid', async (req, res) => {

    const pid = req.params.pid;
    const cid = req.params.cid;
    const qty = req.body;

    const cart = await cartsModel.findOne({ _id: cid });
    const product = await productsModel.findOne({ _id: pid })
    const productIndex = cart.products.findIndex(prod => prod._id == pid)

    if (cart.products.length < 1 || productIndex == -1) {
        await cart.products.push({ _id: product._id, quantity: qty.cantidad });
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        res.send(msg);
        await managerAccess.crearRegistro(`${qty.cantidad} productos agregados al carrito`)
        return
    }


    if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity >= 1) {
        let quantity = cart.products[productIndex].quantity + qty.cantidad
        cart.products[productIndex].quantity = quantity
        try {
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro(`${quantity} productos agregados al carrito`)
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    } else {
        try {
            await cart.products.splice(productIndex, 1);
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            res.send(msg);
            await managerAccess.crearRegistro('Producto eliminado del carrito')
        } catch (error) {
            res.status(400).send({
                error: 'error'
            })
            return
        }
    }
})

// VACIAR CARRITO

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsModel.findOne({ _id: cid });

    try {
        cart.products = [];
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        res.send(msg);
        await managerAccess.crearRegistro('Productos eliminados del carrito')
    } catch (error) {
        res.status(400).send({
            error: 'error'
        })
        return
    }
})

export default router;




