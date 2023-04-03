import fs from 'fs';


export default class ProductManager {
    constructor() {
        this.product = []
        this.path = '../files/Users.json'
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            console.log(products)
            return products;
        } else {
            return [];
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const productos = await this.getProducts();

        let producto = {
            id: productos.length + 1,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        let validacionCodigo = productos.find(validacionCodigo => validacionCodigo.code === code)

        if (validacionCodigo) {
            console.log(`El código de producto ${validacionCodigo.code} ya existe en la base de datos`)
        }
        else {
            title, description, price, thumbnail, code, stock ? productos.push(producto) : console.log('Uno de los productos está imcompleto')
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'))
        }
    }

    getProductById = async (id) => {
        const productos = await this.getProducts();

        let procutoBuscado = productos.find(procutoBuscado => procutoBuscado.id === id)
        if (procutoBuscado) {
            console.log(procutoBuscado)
            return procutoBuscado
        }
        else {
            console.log(`ID ${id} not found.`)
        }
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        const productos = await this.getProducts();

        let modProducto = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        let validacionId = productos.find(validacionId => validacionId.id === id)

        if (validacionId) {
            const productToUpdate = await this.deleteProduct(validacionId.id)
            console.log("SSSS")
            productToUpdate.push(modProducto)
            console.log(productToUpdate)
            await fs.promises.writeFile(this.path, JSON.stringify(productToUpdate, null, '\t'))
        } else {
            console.log('El ID a modificar no existe.')
        }
    }

    deleteProduct = async (id) => {
        const productos = await this.getProducts();

        let validacionId = productos.find(producto => producto.id === id)

        if (validacionId) {
            const productToDelete = productos.filter(id => id.id != validacionId.id)
            await fs.promises.unlink(this.path)
            await fs.promises.writeFile(this.path, JSON.stringify(productToDelete, null, '\t'))
            return productToDelete
        } else {
            console.log('El ID a eliminar no existe.')
        }
    }
}

const AgregaProductos = new ProductManager();
// AgregaProductos.addProduct('Correa para perro', '5 metros', 3500, 'www.correa...', 1000, 30);
// AgregaProductos.addProduct('Comida para ave', '1 Kg', 4500, 'www.com...', 1001, 50);
// AgregaProductos.addProduct('Comida para gato', '3 Kg', 3600, 'www.com...', 1002, 50);
// AgregaProductos.addProduct('Hueso de juguete', 'Fabricado en plástico resistente', 2400, 'www.correa...', 1003, 50);

// console.log(AgregaProductos.getProducts())
// console.log(AgregaProductos.getProductById(1))
// console.log(AgregaProductos.updateProduct(3, 'Hueso de juguete', 'Fabricado en plástico resistente', 2400, 'www.correa...', 1003, 50))
// console.log(AgregaProductos.deleteProduct(2))
