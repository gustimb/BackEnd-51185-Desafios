import { Router } from "express";
import CartsManager from '../manager/CartsManager.js';


const router = Router();
const cartsMan = new CartsManager();


router.get('/', async (req, res) => {
    const carts = await cartsMan.getCarts();
    res.send(carts);
})

router.post('/', async (req, res) => {

    const { products } = req.body;

    if (!products) {
        res.send('Faltan datos')
        return
    }

    const cart = { products }

    const msg = await cartsMan.addCart(cart);
    res.send(msg);
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsMan.getCartById(cid);
    res.send(cart);
})

router.post('/:cid/product/:pid', async (req, res) => {
    const pid = req.params.pid;
    const cid = req.params.cid;
    const cart = await cartsMan.addToCart(cid, pid);
    res.send(cart);
})

export default router; 