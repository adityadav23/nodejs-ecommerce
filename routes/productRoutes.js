const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authMiddleware,
  superAdminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Route to create a new product (only accessible by super admins)
router.post(
  "/",
  authMiddleware,
  superAdminMiddleware,
  upload.single("image"),
  createProduct
);

// Route to get all products (accessible by all users)
router.get("/", getAllProducts);

// Route to get a single product by ID (accessible by all users)
router.get("/:id", getProductById);

// Route to update a product (only accessible by the product creator or super admins)
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);

// Route to delete a product (only accessible by the product creator or super admins)
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
