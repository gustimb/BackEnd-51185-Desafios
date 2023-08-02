import fs from 'fs';
import ProductManager from './ProductManager.js';

const path = './src/files/carrito.json';

const AgregaProductos = new ProductManager();

export default class CartsManager {
    constructor() {
        this.carts = [];
    }

    getCarts = async () => {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, 'utf-8');
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }

    addCart = async (cart) => {
        const carts = await this.getCarts();

        let id = carts.length;

        cart.id = ++id;
        carts.push(cart)

        try {
            await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
            return 'Carrito creado'
        } catch (error) {
            return error
        }
    }

    getCartById = async (id) => {
        const carts = await this.getCarts();

        let cartBuscado = carts.find(cartBuscado => cartBuscado.id == id)
        if (cartBuscado) {
            return cartBuscado.products
        }
        else if (cartBuscado === undefined) {
            return `Cart ID ${id} not found.`
        }
    }

    addToCart = async (cid, pid) => {
        const carts = await this.getCarts();
        const product = await AgregaProductos.getProductById(pid);
        const cartsIndex = carts.findIndex(cart => cart.id == cid)

        let quantity = () => {
            if (carts[cartsIndex].products.id === product.id && carts[cartsIndex].products.quantity) {
                let quantity = carts[cartsIndex].products.quantity + 1
                console.log(carts[cartsIndex].products.quantity)
                return quantity
            } else {
                let quantity = 1
                return quantity
            }
        }

        if (cartsIndex == -1) {
            return 'Número de carrito inválido.'
        } else if (product.id) {
            carts[cartsIndex].products.id = product.id;
            carts[cartsIndex].products.quantity = quantity();

            try {
                await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
                return 'Producto agregado a carrito'
            } catch (error) {
                return error
            }
        } else {
            return 'Número de producto inválido.'
        }
    }
}

