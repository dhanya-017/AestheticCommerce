import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./BlogHome.css";
import LatestBlogSection from './LatestBlogSection';


const slides = [
  {
    image: 'https://images.unsplash.com/photo-1712581927725-6448bbf45c84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3DS',
    title: 'Welcome to the Blogverse',
    description: 'Shop Local. Style Global.',
  },
  {
    image: 'https://images.unsplash.com/photo-1701933802512-bf4ab4bf6918?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Feature of the Day',
    description: '7 Steps to Design a Bed Room.',
  },
  {
    image: 'https://images.unsplash.com/photo-1686636340985-93d40e2f843d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Must-Read Blogs',
    description: '5 Rules of Eco-Friendly Gift Giving!',
  }
];

const BlogHome = ({ onCreateClick }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { image, title, description } = slides[index];

  return (
    <div className="blog-home-container">
      <div className="hero-header">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search blogs..."
            className="search-input"
          />
        </div>

        <button className="create-btn" onClick={onCreateClick}>
          Create Your Own Blog
        </button>
      </div>

      <section
        className="hero-slide"
        style={{ backgroundImage: `url(${image})` }}
      >
        <h2 className="hero-title">{title}</h2>
        <p className="hero-description">{description}</p>
      </section>

      {/* <LatestBlogSection /> */}
    </div>
  );
};

export default BlogHome;