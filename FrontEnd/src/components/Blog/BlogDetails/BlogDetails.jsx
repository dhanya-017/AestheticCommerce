import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

 useEffect(() => {
  axios.get(`http://localhost:5001/users/blogs/${id}`)
    .then(res => {
      console.log("Fetched blog:", res.data);
      setBlog(res.data.blog);
    })
    .catch(err => {
      console.error("Error fetching blog:", err);
    });
}, [id]);

  if (!blog) return <div className="loading">Loading...</div>;

  return (
    <div className="blog-container">
      <img 
        src={`http://localhost:5001${blog.image}`} 
        alt="blog" 
        className="blog-image" 
      />
      <h1 className="blog-title">{blog.title}</h1>
      <p className="blog-meta">
        By <span className="blog-author">{blog.author}</span> on <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
      </p>
      <p className="blog-content">{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
