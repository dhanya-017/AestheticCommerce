const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ADDED: Import mongoose
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const { protect } = require("../Middleware/authMiddleware");
const Notification = require('../models/notification.model');

// -------------------- ID helpers (same logic as model) --------------------
function generateBaseNumericId() {
  const timestampPart = Date.now().toString();
  const randomPart = String(Math.floor(10000 + Math.random() * 90000));
  return `${timestampPart}${randomPart}`;
}

function ensureOrderIds(order) {
  let changed = false;
  if (!order.orderId) {
    const base = generateBaseNumericId();
    order.orderId = `OD${base}`;
    changed = true;
  }
  const baseForItems = String(order.orderId).startsWith('OD') ? String(order.orderId).slice(2) : generateBaseNumericId();
  if (Array.isArray(order.products)) {
    order.products.forEach((p, idx) => {
      if (!p.itemId) {
        try {
          const itemId = String(BigInt(baseForItems) + BigInt(idx));
          p.itemId = itemId;
          changed = true;
        } catch (_) {
          p.itemId = `${baseForItems}${idx}`;
          changed = true;
        }
      }
    });
  }
  return changed;
}

// -------------------- Create a new order --------------------
router.post("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'price sellerId sellerName storeName'
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Build items array
    let items = [];
    if (Array.isArray(req.body.products) && req.body.products.length > 0) {
      // Use provided products but validate & enrich using Product model
      for (const p of req.body.products) {
        if (!p.product) continue;
        const prod = await Product.findById(p.product);
        if (!prod) continue;
        items.push({
          product: prod._id,
          sellerId: prod.sellerId,
          sellerName: prod.sellerName,
          storeName: prod.storeName,
          quantity: p.quantity || 1,
          price: prod.price
        });
      }
    } else {
      // Build from user's cart (recommended)
      if (!user.cart || user.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      items = user.cart.map(c => ({
        product: c.product._id ? c.product._id : c.product,
        sellerId: c.product.sellerId || c.sellerId,
        sellerName: c.product.sellerName || c.sellerName,
        storeName: c.product.storeName || c.storeName,
        quantity: c.quantity,
        price: c.product.price || c.price
      }));
    }

    if (items.length === 0) {
      return res.status(400).json({ message: 'No products to create order' });
    }

    // calculate totalAmount server-side
    const totalAmount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    const payload = {
      user: user._id,
      products: items,
      totalAmount,
      paymentStatus: req.body.paymentStatus || 'Pending',
      deliveryStatus: req.body.deliveryStatus || 'Processing',
      shippingAddress: req.body.shippingAddress || req.user.defaultAddress || {}
    };

    const newOrder = new Order(payload);
    const saved = await newOrder.save();

    // clear user's cart if order created from cart
    if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
      user.cart = [];
      await user.save();
    }

    // populate products.product for response
    const populatedOrder = await Order.findById(saved._id)
      .populate({
        path: 'products.product',
        select: 'name price images',
      })
      .populate('products.sellerId', 'name email');

    // Create notifications for sellers
    const sellerNotifications = {};
    populatedOrder.products.forEach(item => {
      const sellerId = item.sellerId._id.toString();
      if (!sellerNotifications[sellerId]) {
        sellerNotifications[sellerId] = {
          recipient: sellerId,
          recipientModel: 'Seller',
          message: `You have a new order! Order ID: ${populatedOrder.orderId}`,
          link: `/seller/orders/${populatedOrder._id}`,
        };
      }
    });

    await Notification.insertMany(Object.values(sellerNotifications));

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Get orders for currently logged-in user --------------------
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .populate('products.sellerId', 'name email')
      .sort({ createdAt: -1 });

    for (const o of orders) {
      const changed = ensureOrderIds(o);
      if (changed) await o.save();
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Get orders for a seller (seller panel) --------------------
router.get('/seller/orders', protect, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Aggregate orders containing items for this seller
    const orders = await Order.aggregate([
      { $match: { "products.sellerId": mongoose.Types.ObjectId(String(sellerId)) } },
      {
        $addFields: {
          sellerProducts: {
            $filter: {
              input: "$products",
              as: "p",
              cond: { $eq: ["$$p.sellerId", mongoose.Types.ObjectId(String(sellerId))] }
            }
          }
        }
      },
      {
        $project: {
          orderId: 1,
          user: 1,
          totalAmount: 1,
          paymentStatus: 1,
          deliveryStatus: 1,
          shippingAddress: 1,
          cancelledAt: 1,
          createdAt: 1,
          sellerProducts: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json(orders);
  } catch (err) {
    console.error('Seller orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Get orders by user ID (admin) --------------------
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product')
      .populate('products.sellerId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Get single order by order ID or mongo id --------------------
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let order = null;
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId).populate('products.product').populate('products.sellerId', 'name email');
    }
    if (!order) {
      order = await Order.findOne({ orderId }).populate('products.product').populate('products.sellerId', 'name email');
    }
    if (!order) return res.status(404).json({ message: "Order not found" });

    const changed = ensureOrderIds(order);
    if (changed) {
      await order.save();
      order = await Order.findById(order._id).populate('products.product').populate('products.sellerId', 'name email');
    }
    res.status(200).json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Cancel order (user) --------------------
router.patch("/:orderId/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // if any item has advanced status, reject full-cancel
    const blocked = order.products.some(p => ['Shipped', 'Out for Delivery', 'Delivered'].includes(p.status));
    if (blocked) {
      return res.status(400).json({ message: "Order (or some items) cannot be cancelled at this stage" });
    }

    order.deliveryStatus = 'Cancelled';
    order.cancelledAt = new Date();

    // mark each item cancelled
    order.products = order.products.map(p => ({ ...p.toObject ? p.toObject() : p, status: 'Cancelled' }));

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id).populate('products.product').populate('products.sellerId', 'name email');

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Multer for rating images --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images are allowed'));
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// -------------------- Check review eligibility for a product --------------------
router.get('/eligibility/review/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if this user has any order where that product exists and that product's status is Delivered
    const order = await Order.findOne({
      user: req.user._id,
      'products.product': productId,
      'products.status': 'Delivered'
    });

    res.json({ eligible: Boolean(order) });
  } catch (err) {
    console.error('Eligibility error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Submit rating for an order (supports images) --------------------
router.post(
  "/:orderId/rating",
  protect,
  upload.array('photos', 6),
  async (req, res) => {
    try {
      const { stars, text } = req.body;
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to rate this order" });
      }

      // require that all items are delivered before order-level rating
      const allDelivered = order.products.every(p => p.status === 'Delivered');
      if (!allDelivered) {
        return res.status(400).json({ message: "Can only rate orders where all items are delivered" });
      }

      if (order.rating && order.rating.stars) {
        return res.status(400).json({ message: "Order already rated" });
      }

      const photoUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);

      order.rating = {
        stars: Number(stars),
        text: text || '',
        photos: photoUrls,
        submittedAt: new Date(),
      };

      const updatedOrder = await order.save();
      const populatedOrder = await Order.findById(updatedOrder._id).populate('products.product').populate('products.sellerId', 'name email');

      // Create product-level review(s)
      if (order.products && order.products.length > 0) {
        const ProductModel = require('../models/product.model');
        const firstProd = await ProductModel.findById(order.products[0].product);
        if (firstProd) {
          const alreadyReviewed = (firstProd.reviews || []).some((r) => r.user?.toString() === req.user._id.toString());
          if (!alreadyReviewed) {
            firstProd.reviews.push({
              user: req.user._id,
              stars: Number(stars),
              text: text || '',
              photos: photoUrls,
              createdAt: new Date(),
            });
            const total = firstProd.reviews.reduce((s, r) => s + r.stars, 0);
            firstProd.rating = firstProd.reviews.length > 0 ? Number((total / firstProd.reviews.length).toFixed(1)) : 0;
            await firstProd.save();
          }
        }
      }

      res.status(200).json(populatedOrder);
    } catch (err) {
      console.error('Rating error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;