const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes"); // (If you need specific routes for orders)
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// app.use('/api/orders', orderRoutes); // (If using specific order routes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
