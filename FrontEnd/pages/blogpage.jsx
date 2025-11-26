import React, { useState } from "react";
import Navbar from "../src/components/Navbar/Navbar.jsx";
import BlogHome from "../src/components/Blog/BlogHome/BlogHome.jsx";
import BlogForm from "../src/components/Blog/BlogForm/BlogForm.jsx"; // <-- Import your form
import Newsletter from "../src/components/NewsletterSection/Newsletter.jsx";
import Footersec from "../src/components/Footersection/Footersection.jsx";
import LatestBlogSection from "../src/components/Blog/BlogHome/LatestBlogSection.jsx";

const Blog = () => {
  const [showForm, setShowForm] = useState(false); // <- This state decides what to show

  return (
    <div>
      <Navbar />

      {/* Toggle between BlogHome and BlogForm */}
      {showForm ? (
        <BlogForm onBack={() => setShowForm(false)} />
      ) : (
        <BlogHome onCreateClick={() => setShowForm(true)} />
      )}

      {/* These stay visible regardless */}
      <LatestBlogSection />
      <Newsletter />
      <Footersec />
    </div>
  );
};

export default Blog;
