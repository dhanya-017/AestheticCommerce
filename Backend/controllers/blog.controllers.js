const blogService = require('../services/blog.services');
const Blog = require('../models/blog.model');
const { validationResult } = require('express-validator');



//handle Blog creation
module.exports.createBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(404).json({ message: "Invalid data" });
  }

  console.log(req.body);
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  // Check if an image is uploaded
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`; // The image will be stored under 'uploads/' folder
  }

  const blog = await blogService.createBlog({
    title,
    content,
    author,
    image: imageUrl, // Store image URL/path
  });

  res.status(201).json({ blog });
};

//handle Get all blogs
// Fix this:
exports.getBlogs = async (req, res) => {
  console.log("GET /users/blogs hit ✅");

  try {
    const blogs = await Blog.find();
    console.log("Blogs fetched:", blogs);
    res.status(200).json({ blogs }); // ✅ Wrap in object!
  } catch (error) {
    console.error("Error while fetching blogs ❌:", error);
    res.status(500).json({ message: error.message });
  }
};


//handle Get blog by id
module.exports.getBlog = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Blog ID is required' });
  }

  const blog = await blogService.getBlogById(id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.status(200).json({ blog });
};