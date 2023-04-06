import fs from 'fs';

const path = './src/files/products.json';

export default class ProductManager {
    constructor() {
        this.product = []
    }

    getProducts = async () => {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    addProduct = async (product) => {
        const productos = await this.getProducts();

        let id = productos[productos.length - 1].id;

        product.id = ++id;
        productos.push(product)

        try {
            await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'))
            return 'Producto creado'
        } catch (error) {
            return error
        }
    }

    getProductById = async (id) => {
        const productos = await this.getProducts();

        let procutoBuscado = productos.find(procutoBuscado => procutoBuscado.id == id)
        if (procutoBuscado) {
            return procutoBuscado
        }
        else if (procutoBuscado = []) {
            return `ID ${id} not found.`
        }
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        const productos = await this.getProducts();

        const productIndex = productos.findIndex(producto => producto.id == id)

        productos[productIndex].title = title
        productos[productIndex].description = description
        productos[productIndex].price = price
        productos[productIndex].thumbnail = thumbnail
        productos[productIndex].code = code
        productos[productIndex].stock = stock

        try {
            await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'))
            return `Producto ID ${id} modificado con éxito.`
        } catch (error) {
            return error
        }
    }

    deleteProduct = async (id) => {
        const productos = await this.getProducts();

        const productIndex = productos.findIndex(producto => producto.id == id)

        if (productIndex == -1) {
            return `El ID "${id}" a eliminar no existe.`;
        } else {
            productos.splice(productIndex, 1)
            await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'));
            return `Producto ID "${id}" eliminado.`;
        }
    }
}


