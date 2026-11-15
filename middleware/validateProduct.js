const validateProduct = (req, res, next) => {
    const { name, sku, category, price, quantity, reorderLevel, supplier } = req.body;

    if (!name || !sku || !category || !supplier) {
        return res.status(400).json({
            message: "Name, SKU, category and supplier are required"
        });
    }

    if (
        price === undefined ||
        quantity === undefined ||
        reorderLevel === undefined
    ) {
        return res.status(400).json({
            message: "Price, quantity and reorderLevel are required"
        });
    }

    if (
        !Number.isFinite(Number(price)) ||
        !Number.isFinite(Number(quantity)) ||
        !Number.isFinite(Number(reorderLevel)) ||
        Number(price) < 0 ||
        Number(quantity) < 0 ||
        Number(reorderLevel) < 0
    ) {
        return res.status(400).json({
            message: "Price, quantity and reorderLevel must be valid non-negative numbers"
        });
    }

    next();
};

module.exports = validateProduct;