import CartsDaoMongo from "../persistence/carts.dao.mongo.js";

const cartsDao = new CartsDaoMongo();

export default class CartService {
    getCarts = async () => {
        const carts = await cartsDao.getCarts();
        return carts;
    };

    addCart = async () => {
        const cart = await cartsDao.addCart();
        return cart;
    };

    getCartByID = async (cid) => {
        const cart = await cartsDao.getCartByID(cid);
        return cart;
    };

    addProductToCart = async (cid, pid) => {
        const cart = await cartsDao.addProductToCart(cid, pid);
        return cart;
    };

    addProductByQty = async (cid, pid, qty) => {
        const cart = await cartsDao.addProductByQty(cid, pid, qty);
        return cart;
    };

    deleteFromCart = async (cid, pid) => {
        const cart = await cartsDao.deleteFromCart(cid, pid);
        return cart;
    };

    updateCart = async (cid, products) => {
        const cart = await cartsDao.updateCart(cid, products);
        return cart;
    };

    emptyCart = async (cid) => {
        const cart = await cartsDao.emptyCart(cid);
        return cart;
    };

    deleteCart = async (cid) => {
        const cart = await cartsDao.deleteCart(cid);
        return cart;
    };
};