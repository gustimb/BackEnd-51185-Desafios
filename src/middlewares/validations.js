import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

export const checkValidProductFields = (req, res, next) => {

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !price || !code || stock < 0 || !status || !category || !thumbnail) {
        res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
    } else {
        next();
    };
};

export const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.log("No hay usuario en sesión.");
            return res.redirect('/login');
        };
        if (!roles.includes(req.user.role)) {
            return res.json({ status: "error", message: "No autorizado" });
        };
        next();
    };
};

export const premiumOwnProducts = async (req, res, next) => {

    if (req.user.role == "admin") { return next() };

    const product = await productsService.getProductByID(req.params.pid);

    if (!product) {
        res.status(400).json({ message: `No se encuentra el producto con ID: ${req.params.pid}` });
        req.logger.error(`No se encuentra el producto con ID: ${req.params.pid}`);
        return
    };

    if (req.user.role == "premium" && product.owner == req.user._id) {
        req.logger.info(`Usuario << premium >> el producto ${req.params.pid} es de tu propiedad.`);
    } else {
        req.logger.error(`El producto ${req.params.pid} no es de tu propiedad.`);
        return res.status(400).json({ message: `El producto ${req.params.pid} no es de tu propiedad.` });
    };
    next();
};