import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const authHeader = (getState) => {
  const token = getState().user.token;
  return { Authorization: `Bearer ${token}` };
};

const orderService = {
  async listMy(getState) {
    const res = await axios.get(`${API_URL}/api/orders/my-orders`, { headers: authHeader(getState) });
    return res.data;
  },
  async getById(getState, orderId) {
    const res = await axios.get(`${API_URL}/api/orders/${orderId}`, { headers: authHeader(getState) });
    return res.data;
  },
  async create(getState, payload) {
    const res = await axios.post(`${API_URL}/api/orders`, payload, { headers: authHeader(getState) });
    return res.data;
  },
  async cancelOrder(getState, orderId) {
    const res = await axios.patch(`${API_URL}/api/orders/${orderId}/cancel`, {}, { headers: authHeader(getState) });
    return res.data;
  },
  async submitRating(getState, orderId, ratingData) {
    const formData = new FormData();
    formData.append('stars', ratingData.stars);
    if (ratingData.text) formData.append('text', ratingData.text);
    if (Array.isArray(ratingData.photos)) {
      ratingData.photos.forEach((file) => formData.append('photos', file));
    }
    const res = await axios.post(`${API_URL}/api/orders/${orderId}/rating`, formData, { headers: authHeader(getState) });
    return res.data;
  },
};

export default orderService;