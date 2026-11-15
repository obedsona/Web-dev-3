
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer"
            }
        },

        reorderLevel: {
            type: Number,
            required: true,
            min: 0
        },

        supplier: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Calculate total stock value
productSchema.virtual("stockValue").get(function () {
    return this.price * this.quantity;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
