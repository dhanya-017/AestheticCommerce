// routes/productInfo.routes.js
const express = require("express");
const Product = require("../models/product.model");
const { protectSeller } = require("../MiddlewareSellerPanel/sellerPanelauthMidWar");

const router = express.Router();

/**
 * @desc Get all approved products for the logged-in seller
 * @route GET /api/products/my
 * @access Private (seller only)
 */
router.get("/my", protectSeller, async (req, res) => {
  try {
    // ✅ The middleware sets req.user._id (not req.user.id)
    const sellerId = req.user._id;

    // ✅ Fetch only approved products belonging to this seller
    const products = await Product.find({
      sellerId,
      approvalStatus: "approved",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Fetch seller products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching seller products",
      error: error.message,
    });
  }
});

module.exports = router;
