const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order"); // New Order model we'll create
const { check, validationResult } = require("express-validator");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ msg: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title description price image"
    );
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.user.userId;
  const { shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      shippingAddress,
    });

    await order.save();

    // Clear the cart after checkout
    cart.items = [];
    await cart.save();

    res.json({ msg: "Checkout successful", order });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
