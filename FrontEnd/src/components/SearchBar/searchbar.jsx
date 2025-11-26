import React, { useState } from "react";
import { Search, X } from "lucide-react";
import "./searchbar.css"

const trending = [
  "Paper Craft",
  "Wedding Gift",
  "Baby Shower",
  "Festive Gift",
  "Custom Art"
];

const categories = [
  { label: "All", value: "" },
  { label: "Gifts", value: "gifts" },
  { label: "Decor", value: "decor" },
  { label: "Art", value: "art" },
];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      console.log(`Navigating to: /products?tag=${encodeURIComponent(query)}`);
      // In real app: navigate(`/products?tag=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => setQuery("");

  const handleTrendingClick = (item) => {
    setQuery(item);
  };

  return (
    <div className="searchbar-section">
      <div 
        className={`searchbar-form ${isFocused ? "focused" : ""}`}
      >
           <Search className="search-icon1" size={20} />
        <select
          className="category-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        
     
        
        <input
          type="text"
          placeholder="Gifts, decor, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        />
        
        {query && (
          <button 
            type="button" 
            className="clear-btn" 
            onClick={handleClear} 
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
        
        <button 
          type="button" 
          className="submit-btn"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
      
      <div className="trending-searches">
        <span>Trending: </span>
        {trending.map((item) => (
          <button
            key={item}
            className="trending-tag"
            onClick={() => handleTrendingClick(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

     
    </div>
  );
};

export default SearchBar;