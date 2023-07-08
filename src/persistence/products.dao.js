import productsModel from "../Dao/models/products.js";
import ManagerAccess from '../Dao/managers/fileSystem/ManagerAccess.js';

const managerAccess = new ManagerAccess();

export default class ProductDaoMemory {

    getAllProducts = async () => {
        const products = await productsModel.find();
        await managerAccess.crearRegistro('Consulta productos');
        return products;
    };

    getProductByID = async (pid) => {
        const product = await productsModel.find({ _id: pid });
        await managerAccess.crearRegistro(`Consulta producto por ID: ${pid}`);
        return product;
    };

    addProduct = async (product) => {
        const result = await productsModel.create(product);
        await managerAccess.crearRegistro('Se agregó producto con éxito');
        return result;
    };

    updateProduct = async (pid, product) => {
        const productUpdated = await productsModel.updateOne({ _id: pid }, { $set: product });
        await managerAccess.crearRegistro(`Se ha actualizado el producto con ID: ${pid}`);
        return productUpdated;
    };

    deleteProduct = async (pid) => {
        const msg = await productsModel.deleteOne({ _id: pid });
        await managerAccess.crearRegistro(`Se ha eliminado el producto con ID: ${pid}`);
        return msg;
    };
};

