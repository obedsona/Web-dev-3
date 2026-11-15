const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            message: "SKU already exists"
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorMiddleware;