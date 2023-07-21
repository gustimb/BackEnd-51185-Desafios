import productsModel from "../../models/products.js";
import cartsModel from "../../models/carts.js";
import ManagerAccess from '../fileSystem/ManagerAccess.js';

const managerAccess = new ManagerAccess();

class CartManagerDB {
    // TRAER TODOS LOS CARRITOS
    async getAllCarts() {
        const carts = await cartsModel.find();
        await managerAccess.crearRegistro('Consulta carritos');
        return carts;
    }

    // CREAR CARRITO
    async addCart() {
        const newCart = {
            products: [],
        };
        const cart = await cartsModel.create(newCart);
        await managerAccess.crearRegistro('Se creó carrito con éxito');
        return cart;
    }

    // TRAER CARRITO POR ID CON POPULATE
    async getCartById(cid) {
        const cart = await cartsModel.findOne({ _id: cid }).populate('products._id');
        if (!cart) return `No se encuentra el carrito con ID: ${cid}`;
        await managerAccess.crearRegistro(`Busqueda de carrito con ID: ${cid}`);
        return cart;
    }

    // POST AGREGAR AL CARRITO
    async addProductToCart(cid, pid) {
        const cart = await cartsModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid })
        const productIndex = cart.products.findIndex(prod => prod._id == pid)

        if (cart.products.length < 1 || productIndex == -1) {
            await cart.products.push({ _id: product._id, quantity: 1 });
            const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
            await managerAccess.crearRegistro('Producto agregado al carrito')
            return msg
        }

        if (JSON.stringify(cart.products[productIndex]._id) == JSON.stringify(product._id) && cart.products[productIndex].quantity) {
            let quantity = cart.products[productIndex].quantity + 1
            cart.products[productIndex].quantity = quantity
            try {
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto agregado al carrito')
                return msg
            } catch (error) {
                console.log(error)
                return
            }
        } else {
            try {
                await cart.products.push({ _id: product._id, quantity: 1 });
                const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
                await managerAccess.crearRegistro('Producto agregado al carrito')
                return msg
            } catch (error) {
                console.log(error)
                return
            }
        }
    }

    // ACTUALIZAR PRODUCTOS DEL CARRITO
    async updateCart(cid, products) {
        const cart = await cartsModel.findOne({ _id: cid });
        if (!cart) return `El carrito con el id ${cid} no existe`;
        cart.set({ products });
        await cart.save();
        return cart;
    }

    // VACIAR CARRITO
    async deleteAllProductsToCart(cid) {
        const cart = await cartsModel.findOne({ _id: cid });
        if (!cart) return `El carrito con el id ${cid} no existe`;

        cart.products = [];
        const msg = await cartsModel.updateOne({ _id: cid }, { $set: cart });
        await managerAccess.crearRegistro(`Productos eliminados del carrito con el id ${cid}`)
        return msg;
    }
}



export default CartManagerDB;