import ProductsService from "../services/products.service.js";
import { generateFakerProduct } from "../utils.js";

import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateProductErrorInfo } from "../services/ProductErrorInfo.js";

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
        try {
            const pid = req.params.pid;
            const products = await productsService.getProductByID(pid);
            res.send(products);
        } catch (error) {
            console.log(error)
        };
    };

    addProduct = async (req, res) => {
        try {
            const { title, description, code, price, status, stock, category, thumbnail } = req.body;

            if (!title || !description || !price || Number.isNaN(price) || !code || !stock || Number.isNaN(stock) < 1 || !status || !category || !thumbnail) {
                CustomError.createError({
                    name: "Product create error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error al cargar el producto",
                    errorCode: EError.INVALID_JSON
                });
            };

            const result = await productsService.addProduct(req.body);
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

    mockingproducts = (req, res) => {
        let products = [];
        for (let i = 0; i < 100; i++) {
            const product = generateFakerProduct();
            products.push(product);
        };
        res.json({ products });
    };
};
