import ProductDaoMongo from "../persistence/products.dao.mongo.js";

const productDao = new ProductDaoMongo();

export default class ProductService {
    getAllProducts = async () => {
        const products = await productDao.getAllProducts();
        return products;
    };

    getProductByID = async (pid) => {
        const product = await productDao.getProductByID(pid);
        return product;
    };

    addProduct = async (product) => {
        const result = await productDao.addProduct(product);
        return result;
    };

    updateProduct = async (pid, product) => {
        const result = await productDao.updateProduct(pid, product);
        return result;
    };

    deleteProduct = async (pid) => {
        const result = await productDao.deleteProduct(pid);
        return result;
    };
};

