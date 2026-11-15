
const express = require("express");

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productcontroller");

// Create product
router.post("/products", createProduct);

// Get all products
router.get("/products", getAllProducts);

// Get single product
router.get("/products/:id", getProductById);

// Update product
router.put("/products/:id", updateProduct);

// Delete product
router.delete("/products/:id", deleteProduct);

module.exports = router;

