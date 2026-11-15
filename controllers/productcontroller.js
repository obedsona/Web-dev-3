
const Product = require("../models/productmodel");

// 1. CREATE PRODUCT
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};


// 2. GET ALL PRODUCTS WITH FILTERING, SORTING AND PAGINATION
const getAllProducts = async (req, res, next) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = new RegExp(category, "i");
        }

        if (search) {
            filter.name = new RegExp(search, "i");
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const currentPage = Math.max(1, Number(page));
        const perPage = Math.min(100, Math.max(1, Number(limit)));

        if (!Number.isInteger(currentPage) || !Number.isInteger(perPage)) {
            return res.status(400).json({
                message: "Page and limit must be valid integers"
            });
        }

        const sortOrder = sort === "price" ? { price: 1 } :
            sort === "-price" ? { price: -1 } :
            sort === "name" ? { name: 1 } :
            sort === "-name" ? { name: -1 } :
            { createdAt: -1 };

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOrder)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            total,
            page: currentPage,
            totalPages: Math.ceil(total / perPage),
            count: products.length,
            products
        });

    } catch (error) {
        next(error);
    }
};


// 3. GET SINGLE PRODUCT BY ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        next(error);
    }
};


// 4. UPDATE PRODUCT DETAILS
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        next(error);
    }
};


// 5. DELETE PRODUCT
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted",
            id: product._id
        });

    } catch (error) {
        next(error);
    }
};


// 6. LOW STOCK ALERT REPORT
const getLowStockProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json({
            count: products.length,
            lowStockItems: products
        });

    } catch (error) {
        next(error);
    }
};


// 7. CATEGORY-WISE INVENTORY SUMMARY
const getCategorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",

                    totalItems: {
                        $sum: 1
                    },

                    totalQuantity: {
                        $sum: "$quantity"
                    },

                    totalStockValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    },

                    avgPrice: {
                        $avg: "$price"
                    }
                }
            },
            {
                $sort: {
                    totalStockValue: -1
                }
            }
        ]);

        res.status(200).json({
            categories: summary.length,
            summary
        });

    } catch (error) {
        next(error);
    }
};


// 8. RESTOCK / SALE STOCK ADJUSTMENT
const updateStock = async (req, res, next) => {
    try {
        const { change } = req.body;

        if (!Number.isInteger(change) || change === 0) {
            return res.status(400).json({
                message: "Change must be a non-zero integer"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: change < 0 ? -change : 0 }
            },
            {
                $inc: { quantity: change }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            const exists = await Product.exists({ _id: req.params.id });

            if (!exists) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        res.status(200).json({
            message: "Stock updated",
            product
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getCategorySummary,
    updateStock
};