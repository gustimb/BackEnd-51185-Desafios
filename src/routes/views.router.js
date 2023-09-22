import { Router } from 'express';
import ViewsController from "../controllers/views.controller.js";
import { publicAccess, checkRole } from '../middlewares/validations.js';

const router = Router();
const viewsController = new ViewsController();

// RUTAS

router.get('/add-products', checkRole(["admin", "premium"]), viewsController.addProducts);

router.get('/realtimeproducts', checkRole(["admin", "premium"]), viewsController.realtimeproducts);

router.get('/chat', checkRole(["user"]), viewsController.chat);

router.get('/', checkRole(["admin", "premium", "user"]), viewsController.home);

router.get('/products', checkRole(["admin", "premium", "user"]), viewsController.getAllProducts);

router.get('/products/:pid', checkRole(["admin", "premium", "user"]), viewsController.getProductByID);

router.get('/carts/:cid', checkRole(["admin", "premium", "user"]), viewsController.getCartByID);

router.get('/register', publicAccess, viewsController.register);

router.get('/login', publicAccess, viewsController.login);

router.get('/loggertest', viewsController.loggertest);

router.get("/forgot-password", viewsController.forgotPassword);

router.get("/reset-password", viewsController.resetPassword);

router.get("/users-administration", viewsController.usersAdministration);

export default router;

