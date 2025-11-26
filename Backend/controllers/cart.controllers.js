const userModel = require('../models/user.model');
const Product = require('../models/product.model');

// ================= Cart =================

// Get cart
module.exports.getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id)
      .populate({
        path: 'cart.product',
        select: 'name price images sellerId sellerName storeName',
      });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to cart
module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // find existing cart item by product
    const existing = user.cart.find((c) => c.product.toString() === productId);

    if (existing) {
      existing.quantity += quantity || 1;
      existing.price = product.price;
    } else {
      user.cart.push({
        product: productId,
        quantity: quantity || 1,
        price: product.price,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        storeName: product.storeName,
      });
    }

    await user.save();

    const populatedUser = await userModel.findById(user._id)
      .populate({
        path: 'cart.product',
        select: 'name price images sellerId sellerName storeName',
      });

    res.status(200).json({ message: 'Added to cart', cart: populatedUser.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
module.exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity must be a number' });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.cart.id(itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = quantity;
    await user.save();

    const populatedUser = await userModel.findById(user._id)
      .populate({
        path: 'cart.product',
        select: 'name price images sellerId sellerName storeName',
      });

    res.status(200).json({ message: 'Cart updated', cart: populatedUser.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
module.exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter((c) => c._id.toString() !== itemId);
    await user.save();

    const populatedUser = await userModel.findById(user._id)
      .populate({
        path: 'cart.product',
        select: 'name price images sellerId sellerName storeName',
      });

    res.status(200).json({ message: 'Removed from cart', cart: populatedUser.cart });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
module.exports.clearCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
