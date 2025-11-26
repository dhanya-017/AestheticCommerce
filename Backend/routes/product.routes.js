// routes/product.routes.js
// Updated by Tushar - only show approved products on website

const express = require("express");
const Product = require("../models/product.model");
const { protect } = require("../Middleware/authMiddleware");
const Order = require("../models/order.model");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ✅ GET all products (only approved) with optional tag or storeName filter
router.get("/", async (req, res) => {
  try {
    const { tag, store } = req.query;
    const filter = { approvalStatus: "approved" }; // 🔹 Only approved products

    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    if (store) {
      filter.storeName = { $regex: new RegExp(`^${store}$`, "i") }; // case-insensitive exact match
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET products by storeName (only approved)
router.get("/store/:storeName", async (req, res) => {
  try {
    const { storeName } = req.params;
    const products = await Product.find({
      storeName,
      approvalStatus: "approved",
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No approved products found for this store" });
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching store products:", err);
    res.status(500).json({ error: "Server error fetching store products" });
  }
});

// ✅ GET product by ID (only approved)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      approvalStatus: "approved",
    });

    if (!product)
      return res.status(404).json({ error: "Product not found or not approved" });

    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;

// -------------------- Reviews Section --------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

// ✅ POST: Add review for an approved product
router.post("/:id/reviews", protect, upload.array("photos", 6), async (req, res) => {
  try {
    const { stars, text } = req.body;
    const product = await Product.findOne({
      _id: req.params.id,
      approvalStatus: "approved",
    });

    if (!product)
      return res.status(404).json({ error: "Product not found or not approved" });

    const alreadyReviewed = (product.reviews || []).some(
      (r) => r.user?.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    const hasPurchased = await Order.exists({
      user: req.user._id,
      "products.product": product._id,
    });
    if (!hasPurchased) {
      return res
        .status(403)
        .json({ error: "Only customers who purchased this product can review" });
    }

    const photos = (req.files || []).map((f) => `/uploads/${f.filename}`);

    product.reviews.push({
      user: req.user._id,
      stars: Number(stars),
      text: text || "",
      photos,
      createdAt: new Date(),
    });

    const total = product.reviews.reduce((sum, r) => sum + r.stars, 0);
    product.rating =
      product.reviews.length > 0
        ? Number((total / product.reviews.length).toFixed(1))
        : 0;

    await product.save();

    const order = await Order.findOne({
      user: req.user._id,
      deliveryStatus: "Delivered",
      "products.product": product._id,
    });

    if (order && !order.rating) {
      order.rating = {
        stars: Number(stars),
        text: text || "",
        photos,
        submittedAt: new Date(),
      };
      await order.save();
    }

    res.json(product);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// ✅ GET: list reviews for approved product
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      approvalStatus: "approved",
    }).populate("reviews.user", "fullname email");

    if (!product)
      return res.status(404).json({ error: "Product not found or not approved" });

    res.json(product.reviews || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ POST: Mark a review as helpful
router.post("/:productId/reviews/:reviewId/helpful", protect, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findOne({
      _id: productId,
      approvalStatus: "approved",
    });

    if (!product)
      return res.status(404).json({ error: "Product not found or not approved" });

    const review = (product.reviews || []).find(
      (r) => r._id.toString() === reviewId
    );
    if (!review) return res.status(404).json({ error: "Review not found" });

    const userId = req.user._id.toString();
    const alreadyVoted = (review.helpfulVoters || []).some(
      (u) => u.toString() === userId
    );

    if (!alreadyVoted) {
      review.helpfulVoters = review.helpfulVoters || [];
      review.helpfulVoters.push(req.user._id);
      review.helpfulCount =
        typeof review.helpfulCount === "number"
          ? review.helpfulCount + 1
          : 1;
      await product.save();
    }

    return res.json({ reviewId, helpfulCount: review.helpfulCount });
  } catch (err) {
    console.error("Error updating helpful count:", err);
    res.status(500).json({ error: "Failed to update helpful count" });
  }
});

module.exports = router;
