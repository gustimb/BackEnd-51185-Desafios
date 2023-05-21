import { Router } from 'express';
import productsModel from "../Dao/models/products.js";
import cartsModel from "../Dao/models/carts.js";

const router = Router();

router.get('/', async (req, res) => {

    const filterKey = req.query.filterKey;
    const filterValue = req.query.filterValue;
    const { limit = 10 } = req.query;
    const { page = 1 } = req.query;
    const { sort } = req.query;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, totalPages } = await productsModel.paginate({ [filterKey]: filterValue }, { limit, page, sort: { price: sort }, lean: true })
    const products = docs;

    res.render('home', {
        products,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        limit
    })

    const status = {
        status: docs[0] ? "success" : "error",
        payload: docs,
        totalDocs: totalDocs,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? `/?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `/?limit=${limit}&page=${nextPage}` : null
    }

    console.log(status);
    // res.send(status); // Me da error por el res.render de arriba
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

router.get('/products', async (req, res) => {

    const filterKey = req.query.filterKey;
    const filterValue = req.query.filterValue;
    const { limit = 10 } = req.query;
    const { page = 1 } = req.query;
    const { sort } = req.query;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, totalPages } = await productsModel.paginate({ [filterKey]: filterValue }, { limit, page, sort: { price: sort }, lean: true })
    const products = docs;

    res.render('products', {
        products,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        limit
    })

    const status = {
        status: docs[0] ? "success" : "error",
        payload: docs,
        totalDocs: totalDocs,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? `/?limit=${limit}&page=${prevPage}` : null,
        nextLink: hasNextPage ? `/?limit=${limit}&page=${nextPage}` : null
    }

    console.log(status);
    // res.send(status); // Me da error por el res.render de arriba
})

router.get('/products/:pid', async (req, res) => {

    const pid = req.params.pid;
    const product = await productsModel.findOne({ _id: pid })
    res.render('productDetail', product)
})

router.get('/carts/:cid', async (req, res) => {

    const cid = req.params.cid;
    const { products } = await cartsModel.findOne({ _id: cid }).lean()
    res.render('cartDetail', {products, cid: cid})
})

export default router;

