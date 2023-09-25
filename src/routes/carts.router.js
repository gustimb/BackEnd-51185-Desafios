import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { checkRole } from '../middlewares/validations.js';

const router = Router();
const cartsController = new CartsController();

// GET TODOS LOS CARRITOS *

router.get('/', cartsController.getCarts);

// POST CARRITO *

router.post('/', cartsController.addCart);

// GET CARRITO POR ID CON POPULATE *

router.get('/:cid', cartsController.getCartByID);

// POST AGREGAR PRODUCTO AL CARRITO *

router.post('/:cid/product/:pid', checkRole(["user", "premium"]), cartsController.addProductToCart);

// BORRAR PRODUCTO DEL CARRITO *

router.post('/:cid/delete/:pid', cartsController.deleteFromCart);

// PUT SUMAR PRODUCTO POR CANTIDAD AL CARRITO *

router.put('/:cid/product/:pid', checkRole(["user"]), cartsController.addProductByQty);

// PUT SUMAR PRODUCTOS ACTUALIZANDO CARRITO COMPLETO *

router.put('/:cid', checkRole(["user"]), cartsController.updateCart);

// VACIAR CARRITO *

router.delete('/:cid', cartsController.emptyCart);

// ELIMINAR CARRITO *

router.delete('/delete/:cid', cartsController.deleteCart);

// FINALIZAR COMPRA *

router.get('/:cid/purchase', cartsController.purchase);

export default router;




