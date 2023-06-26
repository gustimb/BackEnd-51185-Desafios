export const checkValidProductFields = (req, res, next) => {

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !price || !code || stock < 0 || !status || !category ||  !thumbnail) {
        res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
    } else {
        next();
    }
}
