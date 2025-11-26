import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../../Redux/productSlice";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../ui/Button";
import RatingStars from "../../RatingStars/RatingStars.jsx";
import ProductReviews from "../../../Review/ProductReview/ProductReview.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../ShopM/Breadcrumb/Breadcrumb.jsx";
import Navbar from "../../../Navbar/Navbar.jsx";
import Footersec from "../../../Footersection/Footersection.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../ui/dialog";
import "./ProductDetails.css";
import { addToCartWithBackendSync } from "../../../../Redux/cartSlice";
import {
  addFavoriteToBackend,
  removeFavoriteFromBackend,
} from "../../../../Redux/favoritesSlice";

export const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ProductDetails = () => {
  const { category, subcategory, productName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products: allProducts, loading } = useSelector(
    (state) => state.products
  );
  const favorites = useSelector((state) => state.favorites.items);
  const cart = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const product = allProducts.find(
    (p) =>
      slugify(p.category) === category &&
      slugify(p.subcategory) === subcategory &&
      slugify(p.name) === productName
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [showBuyNowDialog, setShowBuyNowDialog] = useState(false);
  const [pincode, setPincode] = useState("");

  const imageRef = useRef(null);

  const handleNextImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const handleImageHover = (e) => {
    if (e.target.closest(".carousel-button")) {
      setShowZoom(false);
      return;
    }
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
    setShowZoom(true);
  };

  const handleImageLeave = () => {
    setShowZoom(false);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCartWithBackendSync({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity,
        })
      ).unwrap();
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      // Buy now is completely independent of add to cart
      // Navigate directly to checkout with product info in URL params or state
      navigate("/order-checkout", {
        state: {
          buyNowProduct: {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            category: product.category,
            subcategory: product.subcategory,
          },
          isBuyNow: true,
        },
      });
    } catch (error) {
      console.error("Failed to process buy now:", error);
      toast.error("Failed to process buy now request");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!product) return;

    try {
      if (isFavorite) {
        await dispatch(removeFavoriteFromBackend(product._id)).unwrap();
        toast.success(`${product.name} removed from favorites`);
      } else {
        await dispatch(addFavoriteToBackend(product._id)).unwrap();
        toast.success(`${product.name} added to favorites`);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const isFavorite = favorites.includes(product._id);

  const discount =
    product?.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const getBreadcrumbItems = () => {
    if (!product) return [];
    const items = [{ label: "Products", href: "/products" }];
    const categorySlug = slugify(product.category);
    const subcategorySlug = slugify(product.subcategory);

    if (product.category) {
      items.push({ label: product.category, href: `/${categorySlug}` });
    }
    if (product.subcategory) {
      items.push({
        label: product.subcategory,
        href: `/${categorySlug}/${subcategorySlug}`,
      });
    }
    items.push({ label: product.name, href: "" });
    return items;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
        <Footersec />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="not-found-container">
          <h2 className="not-found-title">Product Not Found</h2>
          <p className="not-found-message">
            The product you are looking for does not exist.
          </p>
          <Button
            className="back-to-shop-btn"
            onClick={() => navigate("/shop")}
          >
            Return to Shop
          </Button>
        </div>
        <Footersec />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumb
        className="breadcrumb-container"
        items={getBreadcrumbItems()}
      />

      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Mobile/Tablet Header - Title and Rating Only (Hidden on Desktop) */}
          {/* <div className="mobile-product-header">
            <h1 className="product-title1">{product.name}</h1>
            <div className="rating-container23">
              <RatingStars rating={product.rating} />
            </div>
          </div> */}

          <div className="thumbnail-column">
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${
                    selectedImageIndex === index
                      ? "selected-thumbnail"
                      : "dimmed-thumbnail"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="main-image-container"
            onMouseMove={handleImageHover}
            onMouseLeave={handleImageLeave}
            ref={imageRef}
          >
            {product.images.length > 1 && (
              <button
                className="carousel-button left"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="main-image-wrapper">
              {/* <AnimatePresence mode="popLayout"> */}
              <AnimatePresence>
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="image-animation-container"
                >
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="main-product-image"
                  />
                </motion.div>
                {/* </AnimatePresence> */}

                {/* Mobile dots indicator - only show on mobile */}
                {product.images.length > 1 && (
                  <div className="mobile-dots-container">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`mobile-dot ${
                          selectedImageIndex === index ? "active" : ""
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <button
                onClick={handleFavoriteToggle}
                className={`favorite-button ${
                  isFavorite ? "favorite-active" : ""
                }`}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            {product.images.length > 1 && (
              <button
                className="carousel-button right"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {showZoom && (
              <div className="zoom-overlay">
                <div
                  className="zoom-content"
                  style={{
                    backgroundImage: `url(${product.images[selectedImageIndex]})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div
            className={`product-card-details ${
              showZoom ? "details-dimmed" : ""
            }`}
          >
            {/* Desktop Header - Title and Rating (Hidden on Mobile/Tablet) */}
            <div className="desktop-product-header">
              <h1 className="product-title1">{product.name}</h1>
              <div className="rating-container23">
                <RatingStars rating={product.rating} />
              </div>
            </div>

            <div className="description-container">
              <h3 className="section-title">Description</h3>
              <p className="product-description">{product.description}</p>
            </div>
            {/* Product Details - Shown after image on mobile/tablet, normal position on desktop */}
            <div className="product-details-content">
              <div className="price-container">
                <div className="price-wrapper">
                  <span className="current-price1">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="discount-text">{discount}% off</span>
                  )}
                </div>
              </div>

              <div className="stock-status">
                <span
                  className={`stock-badge ${
                    product.inStock ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="quantity-section">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-selector">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="pincode-section">
                <div className="pincode-checker">
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="pincode-input"
                    maxLength={6}
                  />
                  <button className="check-btn">Check</button>
                </div>
              </div>

              <div className="action-buttons1">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="add-to-cart-btn1"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="buy-now-btn"
                >
                  <span>Buy Now</span>
                </Button>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="tags-container">
                  {product.tags.map((tag) => (
                    <span key={tag} className="product-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBuyNowDialog && (
        <Dialog open={showBuyNowDialog} onOpenChange={setShowBuyNowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Buy {quantity} × {product.name} for ₹
                {(product.price * quantity).toFixed(2)}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBuyNowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleAddToCart();
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <ProductReviews productId={product._id} />
      <Footersec />
    </>
  );
};

export default ProductDetails;