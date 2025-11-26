import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../../Redux/blogSlice";
import "./BlogHome.css";



const CARDS_PER_SLIDE = 4;

const LatestBlogSection = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading, error } = useSelector((state) => state.blogs);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const totalSlides = Math.ceil(blogs.length / CARDS_PER_SLIDE);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (totalSlides || 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!Array.isArray(blogs) || blogs.length === 0) return <p>No blogs found.</p>;

  const start = currentIndex * CARDS_PER_SLIDE;
  const end = start + CARDS_PER_SLIDE;
  let visibleCards = blogs.slice(start, end);

  if (visibleCards.length < CARDS_PER_SLIDE) {
    visibleCards = visibleCards.concat(
      blogs.slice(0, CARDS_PER_SLIDE - visibleCards.length)
    );
  }

  return (
    <section className="latest-blog-section">
      <h2>Latest Blogs</h2>
      <div className="blog-slider">
  {visibleCards.map((blog) => (
    <Link to={`/blogs/${blog._id}`} key={blog._id} className="blog-card-link">
      <div className="blog-card">
        {blog.image && (
          <img
            src={`${import.meta.env.VITE_API_URL}${blog.image}`}
            alt={blog.title}
            className="blog-cover"
          />
        )}
        <div className="blog-content">
          <h2>{blog.title}</h2>
          <h3>{blog.author}</h3>
          <p>{blog.content?.slice(0, 100)}...</p>
        </div>
      </div>
    </Link>
  ))}
</div>
    </section>
  );
};

export default LatestBlogSection;
