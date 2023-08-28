import cartsModel from "../Dao/models/carts.js";
import productsModel from "../Dao/models/products.js";

export default class CartsDaoMongo {
    getCarts = async () => {
        const carts = await cartsModel.find();
        return carts;
    };

    addCart = async () => {
        const newCart = {
            products: []
        };
        const cart = await cartsModel.create(newCart);
        return cart;
    };

    getCartByID = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid }).populate('products._id').lean();
        return cart;
    };

    addProductToCart = async (cid, pid) => {
        const cart = await cartsModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });
        const productIndex = cart.products.findIndex(prod => prod._id == pid);

        if (cart.products.length < 1 || productIndex == -1) {
            await cart.products.push({ _id: product._id, quantity: 1 });
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            return msg;
        };

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity) {
            let quantity = cart.products[productIndex].quantity + 1;
            cart.products[productIndex].quantity = quantity;
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                return msg;
            } catch (error) {
                return;
            };
        } else {
            try {
                await cart.products.push({ _id: product._id, quantity: 1 });
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                return msg;
            } catch (error) {
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
            return msg
        };

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity >= 1) {
            let quantity = cart.products[productIndex].quantity + qty.quantity;
            cart.products[productIndex].quantity = quantity;
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
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
                return msg;
            } catch (error) {
                return error;
            };
        } else {
            try {
                await cart.products.splice(productIndex, 1);
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                return msg;
            } catch (error) {
                return error;
            };
        };
    };

    updateCart = async (cid, products) => {
        const cart = await cartsModel.findOne({ _id: cid });
        cart.set({ products });
        await cart.save();
        return cart;
    };

    emptyCart = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid });

        cart.products = [];
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        return msg;
    };

    deleteCart = async (cid) => {
        const msg = await cartsModel.deleteOne({ _id: cid });
        return msg;
    };
};