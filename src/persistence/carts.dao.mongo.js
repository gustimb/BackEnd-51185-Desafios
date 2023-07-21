import cartsModel from "../Dao/models/carts.js";
import productsModel from "../Dao/models/products.js";
import ManagerAccess from '../Dao/managers/fileSystem/ManagerAccess.js';

const managerAccess = new ManagerAccess();

export default class CartsDaoMongo {
    getCarts = async () => {
        const carts = await cartsModel.find();
        await managerAccess.crearRegistro('Consulta carritos');
        return carts;
    };

    addCart = async () => {
        const newCart = {
            products: []
        };
        const cart = await cartsModel.create(newCart);
        await managerAccess.crearRegistro('Se creó carrito con éxito');
        return cart;
    };

    getCartByID = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid }).populate('products._id').lean();
        if (!cart) return `No se encuentra el carrito con ID: ${cid}`;
        await managerAccess.crearRegistro(`Busqueda de carrito con ID: ${cid}`);
        return cart;
    };

    addProductToCart = async (cid, pid) => {
        const cart = await cartsModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });
        const productIndex = cart.products.findIndex(prod => prod._id == pid);

        if (cart.products.length < 1 || productIndex == -1) {
            await cart.products.push({ _id: product._id, quantity: 1 });
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            await managerAccess.crearRegistro('Producto agregado al carrito');
            return msg;
        };

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity) {
            let quantity = cart.products[productIndex].quantity + 1;
            cart.products[productIndex].quantity = quantity;
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto agregado al carrito');
                return msg;
            } catch (error) {
                console.log(error);
                return;
            };
        } else {
            try {
                await cart.products.push({ _id: product._id, quantity: 1 });
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto agregado al carrito');
                return msg;
            } catch (error) {
                console.log(error);
                return;
            };
        };
    };

    addProductByQty = async (cid, pid, qty) => {

        const cart = await cartsModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });
        const productIndex = cart.products.findIndex(prod => prod._id == pid);

        if (cart.products.length < 1 || productIndex == -1) {
            await cart.products.push({ _id: product._id, quantity: qty.quantity });
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            await managerAccess.crearRegistro(`${qty.quantity} productos agregados al carrito`);
            return msg
        };

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity >= 1) {
            let quantity = cart.products[productIndex].quantity + qty.quantity;
            cart.products[productIndex].quantity = quantity;
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro(`${qty.quantity} productos agregados al carrito`);
                return msg;
            } catch (error) {
                res.status(400).send({
                    error: 'error'
                });
                return;
            }
        } else {
            try {
                await cart.products.splice(productIndex, 1);
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto eliminado del carrito');
                return msg;
            } catch (error) {
                res.status(400).send({
                    error: 'error'
                });
                return;
            };
        };
    };

    deleteFromCart = async (cid, pid) => {
        const cart = await cartsModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });
        const productIndex = cart.products.findIndex(prod => prod._id == pid);

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity > 1) {
            let quantity = cart.products[productIndex].quantity - 1;
            cart.products[productIndex].quantity = quantity;
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto quitado del carrito');
                return msg;
            } catch (error) {
                return error;
            };
        } else {
            try {
                await cart.products.splice(productIndex, 1);
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto eliminado del carrito');
                return msg;
            } catch (error) {
                return error;
            };
        };
    };

    updateCart = async (cid, products) => {
        const cart = await cartsModel.findOne({ _id: cid });
        if (!cart) return `El carrito con el id ${cid} no existe`;
        cart.set({ products });
        await cart.save();
        return cart;
    };

    emptyCart = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid });
        if (!cart) return `El carrito con el id ${cid} no existe`;

        cart.products = [];
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        await managerAccess.crearRegistro(`Productos eliminados del carrito con el id ${cid}`);
        return msg;
    };
};