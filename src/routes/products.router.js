import { Router } from "express";
import { checkValidProductFields } from "../middlewares/validations.js";
import ProductsController from "../controllers/products.controller.js";
import { adminAccess } from '../middlewares/validations.js';

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

router.post('/', adminAccess, productsController.addProduct);

// PUT ACTUALIZAR PRODUCTO

router.put('/:pid', checkValidProductFields, adminAccess, productsController.updateProduct);

// DELETE BORRAR PRODUCTO

router.delete('/:pid', adminAccess, productsController.deleteProduct);

export default router;



