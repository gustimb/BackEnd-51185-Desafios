// import productsModel from "../Dao/models/products.js";
import cartsModel from "../../models/carts.js";

class CartManagerDB {
    // Todos los carritos
    async getAllCarts() {
        const carts = await cartsModel.find();
        return carts;
    }
    // Carrito por ID
    async getCartById(id) {
        const cart = await cartsModel.findOne({ _id: id });
        // console.log(cart)
        if (!cart) return `No se encuentra el carrito con ID: ${id}`;
        return cart;
    }
}

export default CartManagerDB;