const express = require("express");
const multer = require("multer");
const cloudinary = require("../seedFile/configcloud");
const streamifier = require("streamifier");
const Product = require("../models/product.model");
const Admin = require('../models/admin.model');
const Notification = require('../models/notification.model');
const { protectSeller } = require("../MiddlewareSellerPanel/sellerPanelauthMidWar");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Get all products for the logged-in seller
// @route   GET /api/products
// @access  Private (Seller)
router.get('/', protectSeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});


// helper function for cloudinary upload
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "SellerProducts" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

//  Protect route so only logged-in sellers can upload
router.post("/", protectSeller, upload.array("images"), async (req, res) => {
  try {
    console.log(" Incoming product data:", req.body);
    console.log("Incoming files:", req.files?.map(f => f.originalname));

    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      category,
      subcategory,
      tags,
      rating,
      inStock,
    } = req.body;

    const { _id: sellerId, occupation } = req.user;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(" Uploading images to Cloudinary...");
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          console.log(" Uploaded image URL:", result.secure_url);
          return result.secure_url;
        })
      );
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [tags];
      }
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      discountPercentage: parseFloat(discount),
      category,
      subcategory,
      rating: parseInt(rating) || 0,
      inStock: parseInt(inStock) || 0,
      sellerId,
      occupation,
      images: imageUrls,
      tags: Array.isArray(parsedTags) ? parsedTags : [parsedTags],
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    const admins = await Admin.find({});
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      recipientModel: 'Admin',
      message: `New product submitted for approval: ${savedProduct.name}`,
      link: `/admin/products/${savedProduct._id}`,
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Product uploaded successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(" Upload error:", error);
    res.status(500).json({ message: "Server error during product upload" });
  }
});

module.exports = router;