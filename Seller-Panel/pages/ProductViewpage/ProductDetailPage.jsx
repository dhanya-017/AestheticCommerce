import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSellerProducts } from "../../src/Redux/dashboardSlice";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { products, isLoading } = useSelector((state) => state.dashboard);
  const { token } = useSelector((state) => state.auth);

  // Fetch products if not loaded
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchSellerProducts(token));
    }
  }, [dispatch, products, token]);

  // Find product by id
  const product = products?.find((p) => p._id === id);

  // Handle main image
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  // Loader state
  if (isLoading) {
    return (
      <div className="product-detail-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p>Loading product...</p>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="product-detail-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="product-detail-wrapper">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-card">
        {/* Left: Image Section */}
        <div className="product-image-section">
          <div className="main-image-container">
            <img src={mainImage} alt={product.name} className="main-image" />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="thumb"
                  className={`thumbnail ${
                    mainImage === img ? "active" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Section */}
        <div className="product-info-section">
          <div className="product-info-card">
            <h1 className="product-title">{product.name}</h1>

            <div className="price-row">
              <span className="current-price">
                ₹{product.discountedPrice || product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="original-price">
                    ₹{product.originalPrice}
                  </span>
                  <span className="discount">
                    {Math.round(
                      ((product.originalPrice -
                        (product.discountedPrice || product.price)) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="description">{product.description}</p>

            <p className={`stock ${product.inStock ? "in" : "out"}`}>
              {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
            </p>

            {/* ✅ Action Buttons */}
            <div className="action-buttons">
              <button className="dummy-btn">Add to Cart</button>
              <button className="dummy-btn buy">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
