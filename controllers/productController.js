const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const product = new Product({
      title,
      description,
      price,
      image: req.file.path,
      createdBy: req.user.userId,
    });

    await product.save();
    res.json({ msg: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "email"
    );
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.updateProduct = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Allow only the product creator or super admin to update the product
    if (
      product.createdBy.toString() !== req.user.userId &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    const updatedData = {
      title,
      description,
      price,
    };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );
    res.json({ msg: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Allow only the product creator or super admin to delete the product
    if (
      product.createdBy.toString() !== req.user.userId &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    await product.remove();
    res.json({ msg: "Product removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
