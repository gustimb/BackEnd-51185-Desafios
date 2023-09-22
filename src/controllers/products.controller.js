import ProductsService from "../services/products.service.js";
import SessionsService from "../services/sessions.service.js";
import { generateFakerProduct } from "../utils.js";
import { transporter, deletedProductTemplate } from "../config/gmail.js";

import { CustomError } from "../services/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateProductErrorInfo } from "../services/ProductErrorInfo.js";

const productsService = new ProductsService();
const sessionsService = new SessionsService();

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
            const owner = req.user.role === "premium" ? req.user._id : "admin"

            const product = {
                title: req.body.title,
                description: req.body.description,
                code: req.body.code,
                price: Number(req.body.price),
                status: req.body.status,
                stock: Number(req.body.stock),
                category: req.body.category,
                thumbnail: req.body.thumbnail,
                owner: owner
            };

            if (!product.title || !product.description || !product.price || Number.isNaN(product.price) || product.price < 0 || !product.code || !product.stock || Number.isNaN(product.stock) || product.stock < 1 || !product.status || !product.category || !product.thumbnail) {
                CustomError.createError({
                    name: "Product create error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error al cargar el producto",
                    errorCode: EError.INVALID_JSON
                });
                req.logger.error("Error en datos de producto ingresados, no es posible completar la carga.");
            };

            const result = await productsService.addProduct(product);
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
                return;
            };

            const productOwner = product.owner;

            if (productOwner) {
                const user = await sessionsService.getUserById(productOwner);

                if (user.role === "premium" && user.email) {
                    await transporter.sendMail({
                        from: "GMB App",
                        to: user.email,
                        subject: `Tu producto - ${product.title} - fue eliminado`,
                        html: deletedProductTemplate
                    });
                };
            };
            
            const msg = await productsService.deleteProduct(pid);
            req.logger.info(`Producto ID ${product._id} - ${product.title} - fue eliminado.`);
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
