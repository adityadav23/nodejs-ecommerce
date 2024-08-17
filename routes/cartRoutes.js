const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  checkoutCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to add a product to the cart
router.post("/add", authMiddleware, addToCart);

// Route to view the cart
router.get("/", authMiddleware, getCart);

// Route to update a cart item
router.put("/update", authMiddleware, updateCartItem);

// Route to remove a product from the cart
router.delete("/remove", authMiddleware, removeCartItem);

// Route to checkout the cart
router.post("/checkout", authMiddleware, checkoutCart);

module.exports = router;
