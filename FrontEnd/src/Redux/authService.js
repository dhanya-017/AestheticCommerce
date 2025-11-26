import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// ✅ Function to check server status and get bootTime
const checkServerStatus = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/server-status`);
    return res.data.bootTime;
  } catch (error) {
    throw new Error("Failed to fetch server status");
  }
};

// ✅ Register function
const register = async (userData) => {
  const res = await axios.post(`${API_URL}/users/register`, userData);
  const serverBootTime = await checkServerStatus();
  const userDataWithBoot = { ...res.data, bootTime: serverBootTime };
  localStorage.setItem("user", JSON.stringify(userDataWithBoot));
  return userDataWithBoot;
};

// ✅ Login function
const login = async (userData) => {
  const res = await axios.post(`${API_URL}/users/login`, userData);
  const serverBootTime = await checkServerStatus();
  const userDataWithBoot = { ...res.data, bootTime: serverBootTime };
  localStorage.setItem("user", JSON.stringify(userDataWithBoot));
  return userDataWithBoot;
};

const authService = { register, login, checkServerStatus };
export default authService;
