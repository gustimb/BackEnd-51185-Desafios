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
        req.logger.info("Consulta carritos")
        if (!carts) req.logger.error(`No hay carritos para mostrar`);
        res.send(carts);
    };

    addCart = async (req, res) => {
        try {
            const carts = await cartService.addCart();
            req.logger.info("Se creó carrito con éxito");
            res.status(200).json(carts);
        } catch (error) {
            req.logger.error("Error al crear el carrito");
            res.status(400).json({ message: error });
        };
    };

    getCartByID = async (req, res) => {
        const cid = req.params.cid;

        try {
            const cart = await cartService.getCartByID(cid);
            req.logger.info(`Busqueda de carrito con ID: ${cid}`);
            if (!cart) req.logger.error(`No se encuentra el carrito con ID: ${cid}`);
            res.status(200).json(cart);
        } catch (error) {
            req.logger.error(`No se encuentra el carrito con ID: ${cid}`);
            res.status(400).json({ message: error });
        };
    };

    addProductToCart = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const product = await productService.getProductByID(pid);

        if (!product) {
            req.logger.error(`No se ubica el producto ${pid}`);
            return res.status(400).json({ message: `No se ubica el producto ${pid}` });
        };

        if (product.owner == req.user._id) {
            req.logger.error(`No puedes agregar un producto de tu propiedad al carrito`);
            return res.status(400).json({ message: `No puedes agregar un producto de tu propiedad al carrito` });
        };

        try {
            const carts = await cartService.addProductToCart(cid, pid);
            req.logger.info('Producto agregado al carrito');
            res.redirect(`/carts/${cid}`);
        } catch (error) {
            req.logger.error('Error al agregar el producto al carrito');
            res.status(400).json({ message: error });
        };
    };

    addProductByQty = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const qty = req.body;

        try {
            const carts = await cartService.addProductByQty(cid, pid, qty);
            req.logger.info(`${qty.quantity} productos agregados al carrito`);
            res.status(200).json(carts);
        } catch (error) {
            req.logger.error('Error al agregar los productos al carrito');
            res.status(400).json({ message: error });
        };
    };

    deleteFromCart = async (req, res) => {
        const pid = req.params.pid;
        const cid = req.params.cid;

        try {
            const cart = await cartService.deleteFromCart(cid, pid);
            req.logger.info('Producto quitado del carrito');
            // res.status(200).json(cart);
            res.redirect(`/carts/${cid}`);
        } catch (error) {
            req.logger.error('Error al quitar el producto del carrito');
            res.status(400).json({ message: error });
        };
    };

    updateCart = async (req, res) => {
        const { cid } = req.params;
        const products = req.body;

        try {
            const cart = await cartService.updateCart(cid, products);
            if (!cart) req.logger.error(`El carrito con el id ${cid} no existe`);
            req.logger.info(`Carrito ID ${cid} actualizado con éxito`);
            res.status(200).json(cart);
        } catch (error) {
            req.logger.error(`Error al actualizar el carrito ID ${cid}`);
            res.status(400).json({ message: error });
        };
    };

    emptyCart = async (req, res) => {
        const cid = req.params.cid;

        try {
            const cart = await cartService.emptyCart(cid);
            req.logger.info(`Productos eliminados del carrito con el id ${cid}`);
            if (!cart) req.logger.error(`El carrito con el id ${cid} no existe`);
            res.status(200).json(cart);
        } catch (error) {
            req.logger.error('Error al vaciar el carrito');
            res.status(400).json({ message: error });
        };
    };

    deleteCart = async (req, res) => {
        const cid = req.params.cid;

        try {
            const cart = await cartService.deleteCart(cid);
            req.logger.info(`Carrito ID: ${cid} eliminado.`);
            if (!cart) req.logger.error(`El carrito con el id ${cid} no existe`);
            res.status(200).json(cart);
        } catch (error) {
            req.logger.error('Error al eliminar el carrito');
            res.status(400).json({ message: error });
        };
    };

    purchase = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartService.getCartByID(cid);

            if (cart) {
                if (!cart.products.length) {
                    req.logger.info("El carrito está vacío.");
                    return res.send(`
                    <h2>El carrito está vacío!</h2>
                    <a href="/products"><button>Volver a productos</button></a>
                    <hr>
                    `);
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
                        req.logger.error(`Stock insuficiente de producto: ${rejectedProducts[i]._id.title}`);
                    };
                };

                const newTicket = {
                    code: uuidv4(),
                    purchase_datetime: new Date().toLocaleString(),
                    amount: total,
                    purchaser: req.session.user.email,
                    products: ticketProducts
                };

                const ticketCreated = await ticketsService.createTicket(newTicket);
                await cartService.emptyCart(cid);
                req.logger.info(`Compra realizada | TICKET: ${newTicket.code}`);
                res.send(`
                <div>
                    <h1>Compra exitosa!</h1>
                    <h2>Detalle de compra:</h2>
                    <p>Ticket: ${newTicket.code}</p>
                    <p>Fecha: ${newTicket.purchase_datetime}</p>
                    <p>Productos: ${newTicket.products.map(product => `<p> • ${product.productName} x ${product.quantity} = $${product.parcialAmount}</p>`).join('')}</p>
                    <hr>
                    <p>Total: $${newTicket.amount}</p>
                    <hr>
                    <a href="/products"><button>Volver a productos</button></a>
                </div>
                `);
                // res.send({
                //     ticketCreated,
                //     rejectedProducts
                // });

            } else {
                req.logger.error("El carrito no existe");
                res.send("El carrito no existe");
            };
        } catch (error) {
            req.logger.error('Error al completar la compra');
            res.send(error.message);
        };
    };
};