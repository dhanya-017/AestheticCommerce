const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controllers");
const {protect} = require("../Middleware/authMiddleware");

router.get('/cart', protect, cartController.getCart);
router.post('/cart', protect, cartController.addToCart);
router.put('/cart/:itemId', protect, cartController.updateCartItem);
router.delete('/cart/:itemId', protect, cartController.removeCartItem);
router.delete('/cart', protect, cartController.clearCart);

module.exports = router;