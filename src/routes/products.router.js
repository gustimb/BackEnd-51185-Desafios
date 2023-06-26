import { Router } from "express";
import { checkValidProductFields } from "../middlewares/validations.js";
import ProductsController from "../controllers/products.controller.js";

const router = Router();
const productsController = new ProductsController();

// GET TODOS LOS PRODUCTOS

router.get('/', productsController.getAllProducts);

// GET PRODUCTOS CON LIMITE

router.get('/limitquery', productsController.getProductsLimitquery);

// GET PRODUCTO POR ID

router.get('/:pid', productsController.getProductByID);

// POST AGREGAR PRODUCTO

router.post('/', checkValidProductFields, productsController.addProduct);

// PUT ACTUALIZAR PRODUCTO

router.put('/:pid', checkValidProductFields, productsController.updateProduct);

// DELETE BORRAR PRODUCTO

router.delete('/:pid', productsController.deleteProduct);

export default router;



