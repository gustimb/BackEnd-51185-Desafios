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
        }
        if (!roles.includes(req.user.role)) {
            return res.json({ status: "error", message: "No autorizado" });
        }
        next();
    }
}