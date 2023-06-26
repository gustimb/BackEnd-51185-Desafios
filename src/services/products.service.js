import ProductDaoMemory from "../persistence/products.dao.js";

const productDaoMemory = new ProductDaoMemory();

export default class ProductService {
    getAllProducts = async () => {
        const products = await productDaoMemory.getAllProducts();
        return products;
    };

    getProductByID = async (pid) => {
        const product = await productDaoMemory.getProductByID(pid);
        return product;
    };

    addProduct = async (product) => {
        const result = await productDaoMemory.addProduct(product);
        return result;
    };

    updateProduct = async (pid, product) => {
        const result = await productDaoMemory.updateProduct(pid, product);
        return result;
    };

    deleteProduct = async (pid) => {
        const result = await productDaoMemory.deleteProduct(pid);
        return result;
    };
};

