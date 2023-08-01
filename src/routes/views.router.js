import { Router } from 'express';
import ViewsController from "../controllers/views.controller.js";
import { publicAccess } from '../middlewares/validations.js';
import { privateAccess } from '../middlewares/validations.js';
import { adminAccess } from '../middlewares/validations.js';
import { userAccess } from '../middlewares/validations.js';

const router = Router();
const viewsController = new ViewsController();

// RUTAS

router.get('/productadmin', privateAccess, adminAccess, viewsController.productAdmin);

router.get('/chat', privateAccess, userAccess, viewsController.chat);

router.get('/', privateAccess, viewsController.home);

router.get('/products', privateAccess, viewsController.getAllProducts);

router.get('/products/:pid', privateAccess, viewsController.getProductByID);

router.get('/carts/:cid', privateAccess, viewsController.getCartByID);

router.get('/register', publicAccess, viewsController.register);

router.get('/login', publicAccess, viewsController.login);

router.get('/loggertest', viewsController.loggertest);

router.get("/forgot-password", viewsController.forgotPassword);

router.get("/reset-password",viewsController.resetPassword);

export default router;

