import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch seller dashboard stats
const getSellerStats = async (sellerId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${BASE_URL}/api/dashboard/stats/${sellerId}`, config);
  return response.data;
};

// Fetch seller products
const getSellerProducts = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${BASE_URL}/api/productinfo/my`, config);
  return response.data;
};

// Fetch seller orders
const getSellerOrders = async (sellerId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${BASE_URL}/api/dashboard/orders/${sellerId}`, config);
  return response.data;
};

const dashboardService = {
  getSellerStats,
  getSellerProducts,
  getSellerOrders,
};

export default dashboardService;
