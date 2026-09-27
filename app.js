const express = require("express");

const logger = require("./middleware/logger");

const studentRoutes = require("./routes/studentRoutes");


const app = express();


// ==========================================
// Middleware
// ==========================================

// Allows the server to read JSON request data

app.use(express.json());


// Custom logger middleware

app.use(logger);


// ==========================================
// Home Route
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Student Management REST API is running"

    });

});


// ==========================================
// Student Routes
// ==========================================

app.use("/students", studentRoutes);


// ==========================================
// Handle Unknown Routes
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});


// ==========================================
// Start Server
// ==========================================

const PORT = 3000;


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});