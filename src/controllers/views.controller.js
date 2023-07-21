import productsModel from "../Dao/models/products.js";
import ProductsService from "../services/products.service.js";
import CartService from "../services/carts.service.js";

const productsService = new ProductsService();
const cartService = new CartService();

export default class ViewsController {

    productAdmin = (req, res) => {
        res.render('realTimeProducts');
    };

    chat = (req, res) => {
        res.render('chat');
    };

    home = async (req, res) => {
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
        });

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
        };
    };

    getAllProducts = async (req, res) => {
        const filterKey = req.query.filterKey;
        const filterValue = req.query.filterValue;
        const { limit = 10 } = req.query;
        const { page = 1 } = req.query;
        const { sort } = req.query;

        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalDocs, totalPages } = await productsModel.paginate({ [filterKey]: filterValue }, { limit, page, sort: { price: sort }, lean: true })
        const products = docs;

        // console.log(req.session.user)

        res.render('products', {
            user: req.session.user,
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            limit
        });

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
        };
        // console.log(status);
    };

    getProductByID = async (req, res) => {
        try {
            const pid = req.params.pid;
            console.log(pid)
            const product = await productsService.getProductByID(pid)
            res.render('productDetail', product)
        } catch (error) {
            console.log(error)
        };
    };

    getCartByID = async (req, res) => {
        const cid = req.params.cid;
        const { products } = await cartService.getCartByID({ _id: cid });
        res.render('cartDetail', { products, cid: cid });
    };

    register = (req, res) => {
        res.render('register');
    };

    login = (req, res) => {
        res.render('login');
    };

    resetPassword = (req, res) => {
        res.render('resetPassword');
    };

    loggertest = (req, res) => {
        req.logger.debug("nivel debug");
        req.logger.http("nivel http");
        req.logger.info("nivel info");
        req.logger.warning("nivel warning");
        req.logger.error("nivel error");
        req.logger.fatal("nivel fatal");
        res.send("TEST NIVELES");
    };
};