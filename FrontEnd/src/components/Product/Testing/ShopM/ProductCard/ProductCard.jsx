import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import RatingStars from "../../../../Product/RatingStars/RatingStars.jsx";
import { addToCartWithBackendSync } from "../../../../../Redux/cartSlice.js";
import { addFavoriteToBackend, removeFavoriteFromBackend } from "../../../../../Redux/favoritesSlice";
import { toast } from 'react-toastify';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);
  const { items: favoritesIds } = useSelector((state) => state.favorites);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isFavorite = favoritesIds.includes(product._id);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    let interval;
    if (isHovering && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovering, product.images]);

  const calculateDiscount = (actual, striked) => {
    if (!actual || !striked || striked <= actual) return 0;
    return Math.round(((striked - actual) / striked) * 100);
  };

  const discount = calculateDiscount(product.price, product.originalPrice);

  const slugify = (str) => str.toLowerCase().replace(/[\s&]+/g, "-");

  const categorySlug = product.category
    ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "products";

  const subcategorySlug = product.subcategory
    ? product.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "general";

  const productNameSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(
        addToCartWithBackendSync({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
        })
      ).unwrap();

      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !token) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFavoriteFromBackend(product._id)).unwrap();
        toast.success('Removed from favorites');
      } else {
        await dispatch(addFavoriteToBackend(product._id)).unwrap();
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Link
      to={`/${categorySlug}/${subcategorySlug}/${productNameSlug}`}
      className="product-card22"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
      }}
    >
      {discount > 0 && <div className="discount-badge1">{discount}% OFF</div>}

      <button
        className={`productcard-favorite-btn ${
          isMobile ? "mobile-visible" : isHovering ? "visible" : "hidden"
        } ${isFavorite ? "active" : ""}`}
        onClick={handleFavoriteToggle}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <div className="image-container">
        <img
          src={product.images?.[currentImageIndex] || product.images?.[0] || product.image}
          alt={product.name}
          className="product-image5"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div className="product-card-info">
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-rating">
          <RatingStars rating={product.rating || 0} />
        </div>
        <div className="price-stock">
          <div className="price">
            <span className="actual">₹{product.price}</span>
            {product.originalPrice && (
              <span className="striked">₹{product.originalPrice}</span>
            )}
          </div>
          <span className={`stock ${product.inStock ? "in-stock" : "out-of-stock"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className={`add-to-cart ${isHovering || isMobile ? "visible" : ""}`}>
        <button disabled={!product.inStock} onClick={handleAddToCart}>
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;