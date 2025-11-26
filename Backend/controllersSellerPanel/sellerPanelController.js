// controllers/sellerPanelController.js
const {
  registerSellerService,
  loginSellerService,
  getSellerProfileService,
  updateSellerProfileService,
} = require("../servicesSellerPanel/sellerPanelService");

// REGISTER
const registerSeller = async (req, res) => {
  try {
    const result = await registerSellerService(req.body);
    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      ...result,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
const loginSeller = async (req, res) => {
  try {
    const result = await loginSellerService(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROFILE (Protected)
const getSellerProfile = async (req, res) => {
  try {
    // Debug log (optional)
    console.log("req.user:", req.user);

    // Authentication check
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please login first.",
      });
    }

    const sellerId = req.user._id;

    const result = await getSellerProfileService(sellerId);

    res.status(200).json({
      success: true,
      seller: result,
    });
  } catch (error) {
    console.error("Error in getSellerProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE (Protected)
const updateSellerProfile = async (req, res) => {
  try {
    // Authentication check
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please login first.",
      });
    }

    const sellerId = req.user._id;
    const updateData = req.body;

    const result = await updateSellerProfileService(sellerId, updateData);

    res.status(200).json({
      success: true,
      seller: result,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateSellerProfile:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
};
