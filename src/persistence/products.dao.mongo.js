import productsModel from "../Dao/models/products.js";

export default class ProductDaoMongo {

    getAllProducts = async () => {
        const products = await productsModel.find();
        return products;
    };

    getProductByID = async (pid) => {
        const product = await productsModel.findOne({ _id: pid });
        return product;
    };

    addProduct = async (product) => {
        const result = await productsModel.create(product);
        return result;
    };

    updateProduct = async (pid, product) => {
        const productUpdated = await productsModel.updateOne({ _id: pid }, { $set: product });
        return productUpdated;
    };

    deleteProduct = async (pid) => {
        const msg = await productsModel.deleteOne({ _id: pid });
        return msg;
    };
};

