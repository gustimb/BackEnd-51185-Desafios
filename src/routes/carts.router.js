import { Router } from "express";
import CartsManager from '../Dao/managers/CartsManager.js';
import ManagerAccess from '../Dao/managers/ManagerAccess.js';
import cartsModel from "../Dao/models/carts.js";
import productsModel from "../Dao/models/products.js";

const router = Router();
const cartsMan = new CartsManager();
const managerAccess = new ManagerAccess();

// GET TODOS LOS CARRITOS

router.get('/', async (req, res) => {
    const carts = await cartsModel.find();
    // const carts = await cartsMan.getCarts();
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
    // const msg = await cartsMan.addCart(cart);
    const msg = await cartsModel.create(cart);
    res.send(msg);

    await managerAccess.crearRegistro('Se creó carrito con éxito')
})

// GET CARRITO POR ID

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    // const cart = await cartsMan.getCartById(cid);
    const cart = await cartsModel.find({ _id: cid });
    res.send(cart);
    await managerAccess.crearRegistro('Carrito por ID')
})

// POST AGREGAR AL CARRITO

router.post('/:cid/product/:pid', async (req, res) => {

    const pid = req.params.pid;
    const cid = req.params.cid;

    const carts = await cartsModel.find();
    const product = await productsModel.find({ _id: pid })
    console.log(product)
    const cartsIndex = carts.findIndex(cart => cart._id == cid)

    console.log(cartsIndex)

    let quantity = () => {
        if (carts[cartsIndex].products[0].id == product[0]._id && carts[cartsIndex].products[0].quantity) {
            let quantity = carts[cartsIndex].products[0].quantity + 1
            return quantity
        } else {
            let quantity = 1
            return quantity
        }
    }

    if (cartsIndex == -1) {
        await managerAccess.crearRegistro('Número de carrito inválido')
        res.status(400).send({
            error: 'Número de carrito inválido'
        })
        return
    } else if (product[0]._id) {

        carts[cartsIndex].products[0].id = product[0]._id;
        carts[cartsIndex].products[0].quantity = quantity();

        try {
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: carts[cartsIndex] });
            res.send(msg);
            await managerAccess.crearRegistro('Producto agregado a carrito')
        } catch (error) {
            res.status(400).send({
                error: 'Número de producto inválido'
            })
            return
        }
    } else {
        await managerAccess.crearRegistro('Número de producto inválido')
        res.status(400).send({
            error: 'Número de producto inválido'
        })
        return
    }
})

export default router;




