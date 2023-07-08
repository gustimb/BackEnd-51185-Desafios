import { v4 as uuidv4 } from "uuid";
import CartService from "../services/carts.service.js";
import ProductService from "../services/products.service.js";
import TicketsService from "../services/tickets.service.js";

const cartService = new CartService();
const productService = new ProductService();
const ticketsService = new TicketsService();

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

    purchase = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartByID(cid);

            if (cart) {
                if (!cart.products.length) {
                    return res.send("El carrito está vacío.");
                };

                const ticketProducts = [];
                const rejectedProducts = [];
                let total = 0;

                for (let i = 0; i < cart.products.length; i++) {

                    const cartProduct = cart.products[i];
                    const producDB = await productService.getProductByID(cartProduct._id._id);

                    if (cartProduct.quantity <= producDB.stock) {

                        producDB.stock -= cartProduct.quantity;
                        await producDB.save();

                        ticketProducts.push({
                            productName: cartProduct._id.title,
                            productID: cartProduct._id._id,
                            price: cartProduct._id.price,
                            quantity: cartProduct.quantity,
                            parcialAmount: cartProduct.quantity * cartProduct._id.price
                        });
                        total += cartProduct.quantity * producDB.price;
                    };

                    if (cartProduct.quantity > producDB.stock) {
                        rejectedProducts.push(cartProduct);
                        await cartService.updateCart(cid, rejectedProducts);
                        console.log(`Stock insuficiente de producto: ${rejectedProducts[i]._id.title}`);
                    };
                };

                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleDateString(),
                    amount: total,
                    purchaser: req.session.user.email,
                    products: ticketProducts
                };

                const ticketCreated = await ticketsService.createTicket(newTicket);
                res.send({
                    ticketCreated,
                    rejectedProducts
                });

            } else {
                res.send("El carrito no existe");
            };
        } catch (error) {
            res.send(error.message);
        };
    };
};