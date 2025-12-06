const statsService = require('../services/statsService');

const getCategoryStats = async (req, res) => {
  try {
    const categoryData = await statsService.getProductsByCategory();
    res.status(200).json({ success: true, data: categoryData });
  } catch (err) {
    console.error("Error fetching category stats:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
    getCategoryStats,
};
