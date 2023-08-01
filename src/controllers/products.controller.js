import ProductsService from "../services/products.service.js";
import { generateFakerProduct } from "../utils.js";

import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateProductErrorInfo } from "../services/ProductErrorInfo.js";

const productsService = new ProductsService();

export default class ProductsController {
    getAllProducts = async (req, res) => {
        const products = await productsService.getAllProducts();
        req.logger.info("Consulta productos")
        if (!products) req.logger.error(`No hay productos para mostrar`);
        res.send(products);
    };

    getProductsLimitquery = async (req, res) => {
        const limit = req.query.limit;
        const productos = await productsService.getAllProducts();

        if (!limit || isNaN(limit)) {
            req.logger.info("Consulta productos")
            res.send(productos);
        } else {
            const productLimit = productos.slice(0, limit);
            req.logger.info(`Consulta con límite de ${limit} productos.`)
            res.send(productLimit);
        };
    };

    getProductByID = async (req, res) => {
        const pid = req.params.pid;

        try {
            const products = await productsService.getProductByID(pid);
            req.logger.info(`Busqueda de producto con ID: ${pid}`);
            if (!products) {
                res.status(400).json({ message: `No se encuentra el producto con ID: ${pid}` });
                req.logger.error(`No se encuentra el producto con ID: ${pid}`);
                return
            };
            res.send(products);
        } catch (error) {
            req.logger.error(`No se encuentra el producto con ID: ${pid}`);
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
                req.logger.error("Error en datos de producto ingresados, no es posible completar la carga.");
            };

            const result = await productsService.addProduct(req.body);
            req.logger.info("Producto agregado con éxito");
            res.json({ status: "success", result: result, message: "Producto agregado" });
        } catch (error) {
            req.logger.error("Error al agregar el producto");
            res.status(400).json({ status: "error", message: error.message });
        };
    };

    updateProduct = async (req, res) => {
        const pid = req.params.pid;
        const product = req.body;

        try {
            const productUpdated = await productsService.updateProduct(pid, product);
            req.logger.info(`Producto ID ${pid} actualizado con éxito`);
            res.json({ status: "success", result: productUpdated, message: "Producto actualizado" });
        } catch (error) {
            req.logger.error(`Error al actualizar el producto ID ${pid}`);
            res.status(400).json({ message: error });
        };
    };

    deleteProduct = async (req, res) => {
        const pid = req.params.pid;

        try {
            const product = await productsService.getProductByID(pid);
            if (!product) {
                res.status(400).json({ message: `No se encuentra el producto con ID: ${pid}, no es posible eliminarlo` });
                req.logger.error(`No se encuentra el producto con ID: ${pid}, no es posible eliminarlo`);
                return
            };

            const msg = await productsService.deleteProduct(pid);
            req.logger.info(`Producto ${pid} eliminado`);
            res.send(msg);

        } catch (error) {
            req.logger.error(`Error al eliminar producto ${pid}`);
            res.status(400).json({ message: error });
        }
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
