import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// REGISTER SELLER
const registerSeller = async (sellerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/seller/register`, sellerData);

    if (response.data.success && response.data.token) {
      localStorage.setItem("sellerToken", response.data.token);
      localStorage.setItem("sellerData", JSON.stringify(response.data.seller));
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    const message =
      error.response?.data?.message || error.message || "Registration failed";
    throw new Error(message);
  }
};

// LOGIN SELLER
const loginSeller = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/seller/login`, loginData);

    if (response.data.success && response.data.token) {
      localStorage.setItem("sellerToken", response.data.token);
      localStorage.setItem("sellerData", JSON.stringify(response.data.seller));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

// LOGOUT
const logout = () => {
  localStorage.removeItem("sellerToken");
  localStorage.removeItem("sellerData");
};

const authService = {
  registerSeller,
  loginSeller,
  logout,
};

export default authService;
