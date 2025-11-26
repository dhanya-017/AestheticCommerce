const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  originalPrice: {
    type: Number,
  },

  discountPercentage: {
    type: Number,
  },

  images: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },

  category: {
    type: String,
    required: true,
  },

  subcategory: {
    type: String,
  },

  rating: {
    type: Number,
    default: 0,
  },

  inStock: {
    type: Number,
    required: true,
    default: 0,
  },

  tags: {
    type: [String],
  },

  //Reviews of product - keep in mind rating and review are different but should be linked 
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      stars: { type: Number, min: 1, max: 5, required: true },
      text: { type: String, default: "" },
      photos: [{ type: String }],
      // what are these two field do 
      helpfulCount: { type: Number, default: 1 },
      helpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      createdAt: { type: Date, default: Date.now },
    },
  ],

  //  Seller-related fields 
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", 
    required: true,
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  adminNotes: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("Product", productSchema);