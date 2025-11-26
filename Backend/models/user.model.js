const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= User Schema =================
const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastname: {
      type: String,
      minlength: 3,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // don’t return password in queries by default
  },

  phone: {
    type: String,
    minlength: 10,
  },

  address: {
    type: String,
    minlength: 5,
  },

  // Multiple saved addresses
  savedAddresses: [
    {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    }
  ],

  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],

  // ============== Cart ==============
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: 1 },
      price: { type: Number, required: true },

      // ✅ match Product model fields
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
      sellerName: { type: String },
      storeName: { type: String },
    }
  ],
});

// ================= Methods =================

// Generate a unique JWT token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Hash password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
