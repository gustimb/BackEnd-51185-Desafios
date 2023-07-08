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

export const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

export const adminAccess = (req, res, next) => {
    if (req.session.user.role != "admin") {
        res.status(401).json({ status: "error", message: "No autorizado: Se requieren permisos de ADMIN." });
    } else {
        next();
    };
};

export const userAccess = (req, res, next) => {
    if (req.session.user.role != "user") {
        res.status(401).json({ status: "error", message: "No autorizado: Acción permitida solo a usuarios." });
    } else {
        next();
    };
};