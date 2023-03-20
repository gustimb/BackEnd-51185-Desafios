class ProductManager {
    constructor() {
        this.product = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        let producto = {
            id: this.product.length + 1,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        let validacionCodigo = this.product.find(validacionCodigo => validacionCodigo.code === code)

        if (validacionCodigo) {
            console.log(`El código de producto ${validacionCodigo.code} ya existe en la base de datos`)
        }
        else {
            title, description, price, thumbnail, code, stock ? this.product.push(producto) : console.log('Uno de los productos está imcompleto')
        }
    }

    getProducts() {
        return this.product
    }

    getProductById(id) {
        let procutoBuscado = this.product.find(procutoBuscado => procutoBuscado.id === id)

        if (procutoBuscado) {
            return procutoBuscado
        }
        else {
            console.log(`ID ${id} not found.`)
        }
    }
}

const productos = new ProductManager();
productos.addProduct('Correa para perro', '5 metros', 3500, 'www.correa...', 1000, 200);
productos.addProduct('Comida para ave', '1 Kg', 4500, 'www.com...', 1001, 50);
productos.addProduct('Comida para gato', '3 Kg', 3600, 'www.com...', 1002, 50);
productos.addProduct('Hueso de juguete', 'Fabricado en plástico resistente', 2400, 'www.correa...', 1000, 50);

console.log(productos.getProducts())
console.log(productos.getProductById(3))


