import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { userAccess } from '../middlewares/validations.js';

const router = Router();
const cartsController = new CartsController();

// GET TODOS LOS CARRITOS

router.get('/', cartsController.getCarts);

// POST CARRITO

router.post('/', cartsController.addCart);

// GET CARRITO POR ID CON POPULATE

router.get('/:cid', cartsController.getCartByID);

// POST AGREGAR PRODUCTO AL CARRITO

router.post('/:cid/product/:pid', userAccess, cartsController.addProductToCart);

// BORRAR PRODUCTO DEL CARRITO

router.delete('/:cid/product/:pid', cartsController.deleteFromCart);

// PUT SUMAR PRODUCTO POR CANTIDAD AL CARRITO

router.put('/:cid/product/:pid', userAccess, cartsController.addProductByQty);

// PUT SUMAR PRODUCTOS ACTUALIZANDO CARRITO COMPLETO

router.put('/:cid', userAccess, cartsController.updateCart);

// VACIAR CARRITO

router.delete('/:cid', cartsController.emptyCart);

// FINALIZAR COMPRA

router.get('/:cid/purchase', cartsController.purchase);

export default router;




