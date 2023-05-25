import { Router } from 'express';
import productsModel from "../Dao/models/products.js";
import cartsModel from "../Dao/models/carts.js";

const router = Router();
const publicAcces = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}
const privateAcces = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

// RUTAS

router.get('/realtimeproducts', privateAcces, (req, res) => {
    res.render('realTimeProducts')
})

router.get('/chat', privateAcces, (req, res) => {
    res.render('chat')
})

router.get('/', privateAcces, async (req, res) => {
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
})

router.get('/products', privateAcces, async (req, res) => {
    const filterKey = req.query.filterKey;
    const filterValue = req.query.filterValue;
    const { limit = 10 } = req.query;
    const { page = 1 } = req.query;
    const { sort } = req.query;

    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, totalPages } = await productsModel.paginate({ [filterKey]: filterValue }, { limit, page, sort: { price: sort }, lean: true })
    const products = docs;

    res.render('products', {
        user: req.session.user,
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
    // console.log(status);
})

router.get('/products/:pid', privateAcces, async (req, res) => {
    const pid = req.params.pid;
    const product = await productsModel.findOne({ _id: pid })
    res.render('productDetail', product)
})

router.get('/carts/:cid', privateAcces, async (req, res) => {
    const cid = req.params.cid;
    const { products } = await cartsModel.findOne({ _id: cid }).lean()
    res.render('cartDetail', { products, cid: cid })
})

router.get('/register', publicAcces, (req, res) => {
    res.render('register')
})

router.get('/login', publicAcces, (req, res) => {
    res.render('login')
})


export default router;

