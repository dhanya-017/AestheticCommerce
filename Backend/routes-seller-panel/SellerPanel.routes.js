const express = require("express");
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile
} = require("../controllersSellerPanel/sellerPanelController");
const { protectSeller } = require("../MiddlewareSellerPanel/sellerPanelauthMidWar");
const Product = require("../models/product.model");

const router = express.Router();

// Public routes
router.post("/register", registerSeller);
router.post("/login", loginSeller);

// Protected routes (authentication required)
router.get("/profile", protectSeller, getSellerProfile);
router.put("/profile", protectSeller, updateSellerProfile); // shambhavi-madhav code

// Get all products for the logged-in seller
router.get("/products", protectSeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
