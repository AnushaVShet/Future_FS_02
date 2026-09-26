const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Client Lead Management System API is running!"
    });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });