import ProductsService from "../services/products.service.js";
import multer from "multer";
import __dirname from "../utils.js";


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

export const checkAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.json({ status: "error", message: "Necesita estar autenticado" });
    }
}

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

const validFields = (body) => {
    const { email, password } = body;
    if (!email || !password) {
        return false;
    } else {
        return true;
    }
};

const multerFilterProfile = (req, file, cb) => {
    const isValid = validFields(req.body);
    if (isValid) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/multer/users/profile`)
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-perfil-${file.originalname}`)
    }
})

export const uploaderProfile = multer({ storage: profileStorage, fileFilter: multerFilterProfile })


const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/multer/users/documents`);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user._id}-document-${file.originalname}`);
    }
})

export const uploaderDocument = multer({ storage: documentStorage });

//configuracion para guardar imagenes de productos
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/multer/products/images"));
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-image-${file.originalname}`);
    }
})

