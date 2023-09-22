export const generateProductErrorInfo = (product) => {
    return `
    Alguno de los campos para crear el producto no es valido:
    Lista de campos requeridos:
    title: Debe ser un campo string, se recibió -- ${product.title} --.
    description: Debe ser un campo string, se recibió -- ${product.description} --.
    code: Debe ser un campo string, se recibió -- ${product.code} --.
    price: Debe ser un campo number, se recibió -- ${product.price} --.    
    status: Debe ser un campo string, se recibió -- ${product.status} --.
    stock: Debe ser un campo number con valor "1" o superior, se recibió -- ${product.stock} --.
    category: Debe ser un campo string, se recibió -- ${product.category} --.
    thumbnail: Debe ser un campo string, se recibió -- ${product.thumbnail} --.
    `
};




