const express = require("express");
const router = express.Router();

const {
  getCategoryStats,
} = require("../controllers/statsController");

const { protectAdmin } = require("../MiddlewareAdminPanel/Adminauth.middleware");

// Category-wise analytics
router.get("/category-stats", protectAdmin, getCategoryStats);

module.exports = router;
