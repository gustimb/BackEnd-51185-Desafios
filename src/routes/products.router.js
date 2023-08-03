import { Router } from "express";
import { checkValidProductFields } from "../middlewares/validations.js";
import ProductsController from "../controllers/products.controller.js";
import { checkRole, premiumOwnProducts } from '../middlewares/validations.js';

const router = Router();
const productsController = new ProductsController();

// GET TODOS LOS PRODUCTOS

router.get('/', productsController.getAllProducts);

// GET PRODUCTOS CON LIMITE

router.get('/limitquery', productsController.getProductsLimitquery);

// FAKER

router.get('/mockingproducts', productsController.mockingproducts);

// GET PRODUCTO POR ID

router.get('/:pid', productsController.getProductByID);

// POST AGREGAR PRODUCTO

router.post('/', checkRole(["admin", "premium"]), productsController.addProduct);

// PUT ACTUALIZAR PRODUCTO

router.put('/:pid', checkValidProductFields, checkRole(["admin", "premium"]), premiumOwnProducts, productsController.updateProduct);

// DELETE BORRAR PRODUCTO

router.delete('/:pid', checkRole(["admin", "premium"]), premiumOwnProducts, productsController.deleteProduct);

export default router;



