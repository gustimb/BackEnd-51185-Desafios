import CartService from "../services/carts.service.js";

const cartService = new CartService();

export default class CartsController {
    getCarts = async (req, res) => {
        const carts = await cartService.getCarts();
        res.send(carts);
    };

    addCart = async (req, res) => {
        try {
            const carts = await cartService.addCart();
            res.status(200).json(carts);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    getCartByID = async (req, res) => {
        const cid = req.params.cid;

        try {
            const cart = await cartService.getCartByID(cid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    addProductToCart = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;

        try {
            const carts = await cartService.addProductToCart(cid, pid);
            res.status(200).json(carts);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    addProductByQty = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const qty = req.body;

        try {
            const carts = await cartService.addProductByQty(cid, pid, qty);
            res.status(200).json(carts);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    deleteFromCart = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;

        try {
            const cart = await cartService.deleteFromCart(cid, pid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;

        try {
            const cart = await cartService.updateCart(cid, products);
            res.status(200).json(cart);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    emptyCart = async (req, res) => {
        const cid = req.params.cid;

        try {
            const cart = await cartService.emptyCart(cid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };
};