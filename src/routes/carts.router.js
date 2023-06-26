import { Router } from "express";
import cartsModel from "../Dao/models/carts.js";
import productsModel from "../Dao/models/products.js";
import CartManagerDB from "../Dao/managers/DB/cartManagerDB.js";

const router = Router();
const cartManagerDB = new CartManagerDB();

// GET TODOS LOS CARRITOS

router.get('/', async (req, res) => {
    const carts = await cartManagerDB.getAllCarts();
    res.send(carts);
})

// POST CARRITO

router.post('/', async (req, res) => {
    try {
        const carts = await cartManagerDB.addCart();
        res.status(200).json(carts);
    } catch (error) {
        console.log(error);
    }
})

// GET CARRITO POR ID CON POPULATE

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartManagerDB.getCartById(cid);
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
    }
})

// POST AGREGAR PRODUCTO AL CARRITO

router.post('/:cid/product/:pid', async (req, res) => {

    const pid = req.params.pid;
    const cid = req.params.cid;

    try {
        const carts = await cartManagerDB.addProductToCart(cid, pid);
        res.status(200).json(carts);
    } catch (error) {
        console.log(error);
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

// PUT SUMAR PRODUCTOS ACTUALIZANDO CARRITO COMPLETO

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;

    try {
        const cart = await cartManagerDB.updateCart(cid, products);
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
    }
});

// VACIAR CARRITO

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartManagerDB.deleteAllProductsToCart(cid)
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
    }
})

export default router;




