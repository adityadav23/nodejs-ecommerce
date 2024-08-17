const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to add a product to the cart (only accessible by logged-in users)
router.post("/add", authMiddleware, addToCart);

// Route to view the cart (only accessible by logged-in users)
router.get("/", authMiddleware, getCart);

// Route to update a cart item (only accessible by logged-in users)
router.put("/update", authMiddleware, updateCartItem);

// Route to remove a product from the cart (only accessible by logged-in users)
router.delete("/remove", authMiddleware, removeCartItem);

module.exports = router;
