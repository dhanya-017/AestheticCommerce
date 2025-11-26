// src/redux/slices/blogService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 

const getAllBlogs = async () => {
  const response = await axios.get(`${API_URL}/users/blogs`);
  return response.data.blogs; // <-- just return the array
};

const getSingleBlog = async (id) => {
  const response = await axios.get(`${API_URL}/blogs/${id}`);
  return response.data.blog;
};

const createBlog = async (blogData) => {
  const response = await axios.post(`${API_URL}/users/blog`, blogData);
  return response.data.blog;
};

const blogService = {
  getAllBlogs,
  getSingleBlog,
  createBlog,
};

export default blogService;
