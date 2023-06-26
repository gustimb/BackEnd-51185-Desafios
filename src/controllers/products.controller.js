import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export default class ProductsController {
    getAllProducts = async (req, res) => {
        const products = await productsService.getAllProducts();
        res.send(products);
    };

    getProductsLimitquery = async (req, res) => {
        const limit = req.query.limit;
        const productos = await productsService.getAllProducts();

        if (!limit) {
            res.send(productos);
        } else {
            const productLimit = productos.slice(0, limit);
            res.send(productLimit);
        };
    };

    getProductByID = async (req, res) => {
        const pid = req.params.pid;
        const products = await productsService.getProductByID(pid);
        res.send(products);
    };

    addProduct = async (req, res) => {
        try {
            const product = req.body;
            const result = await productsService.addProduct(product);
            res.json({ status: "success", result: result, message: "Producto agregado" });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        };
    };

    updateProduct = async (req, res) => {
        try {
            const pid = req.params.pid;
            const product = req.body;
            const productUpdated = await productsService.updateProduct(pid, product);
            res.json({ status: "success", result: productUpdated, message: "Producto actualizado" });
        } catch (error) {
            res.status(400).json({ message: error });
        };
    };

    deleteProduct = async (req, res) => {
        const pid = req.params.pid;
        const msg = await productsService.deleteProduct(pid);
        res.send(msg);
    };

};
