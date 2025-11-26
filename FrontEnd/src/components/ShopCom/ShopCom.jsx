// src/components/ShopPage/ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../Redux/productSlice';
import './ShopCom.css';
import RatingStars from '../Product/RatingStars/RatingStars';

// Function to extract unique stores from product data
const extractStoresFromProducts = (products) => {
  const storeMap = new Map();

  products.forEach(product => {
    if (product.storeName && product.sellerName) {
      if (!storeMap.has(product.storeName)) {
        storeMap.set(product.storeName, {
          name: product.storeName,
          sellerName: product.sellerName,
          products: [],
          totalProducts: 0,
          averageRating: 0,
          totalRating: 0,
          ratingCount: 0
        });
      }
      
      const store = storeMap.get(product.storeName);
      store.products.push(product);
      store.totalProducts += 1;
      
      if (product.rating) {
        store.totalRating += product.rating;
        store.ratingCount += 1;
      }
    }
  });

  // Calculate average ratings and get first product image for each store
  const stores = Array.from(storeMap.values()).map(store => {
    const averageRating = store.ratingCount > 0 ? (store.totalRating / store.ratingCount).toFixed(1) : 4.5;
    const firstProduct = store.products[0];
    
    return {
      name: store.name,
      sellerName: store.sellerName,
      location: `${store.sellerName}'s Store`,
      rating: parseFloat(averageRating),
      products: store.totalProducts,
      img: firstProduct?.images?.[0] || 'https://images.pexels.com/photos/3735644/pexels-photo-3735644.jpeg?auto=compress&cs=tinysrgb&w=200',
      icon: '🏪'
    };
  });

  return stores;
};

const ShopCom = () => {
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get products from Redux store
  const productsFromRedux = useSelector(state => state.products?.products || []);
  const loadingState = useSelector(state => state.products?.loading || false);
  
  useEffect(() => {
    // Fetch products if they haven't been loaded yet
    if (productsFromRedux.length === 0 && !loadingState) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsFromRedux.length, loadingState]);
  
  useEffect(() => {
    if (!loadingState && productsFromRedux.length > 0) {
      const extractedStores = extractStoresFromProducts(productsFromRedux);
      setStores(extractedStores);
      setLoading(false);
    } else if (!loadingState && productsFromRedux.length === 0) {
      // No products available
      setStores([]);
      setLoading(false);
    }
  }, [productsFromRedux, loadingState]);

  // Group stores into categories to match the image layout
  const bestSellingStores = stores.slice(0, 3);
  const delhiStores = stores.slice(3, 8); // Show more stores in this section
  const mumbaiStores = stores.slice(8, 11);

  if (loading || loadingState) {
    return (
      <div className="shop-container">
        <div className="loading-state">
          <h2>Loading shops...</h2>
          <p>Please wait while we fetch the latest shop information.</p>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="shop-container">
        <div className="no-shops-state">
          <h2>No shops available</h2>
          <p>There are currently no shops with products available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {bestSellingStores.length > 0 && (
        <Section title="Best Selling Shops" items={bestSellingStores} />
      )}
      {delhiStores.length > 0 && (
        <Section title="Delhi Based Shops" items={delhiStores} />
      )}
      {mumbaiStores.length > 0 && (
        <Section title="Mumbai Based Shops" items={mumbaiStores} />
      )}
    </div>
  );
};

const Section = ({ title, items }) => (
  <div className="shop-section">
    <h2>{title}</h2>
    <div className="shop-cards">
      {items.map((shop, index) => (
        <Link 
          to={`/shop-products?store=${encodeURIComponent(shop.name)}`} 
          className="shop-card" 
          key={index}
        >
          <img src={shop.img} alt={shop.name} />
          <div className="shop-info">
            <h3>{shop.name}</h3>
            <div className="shop-stats">
              <RatingStars rating={shop.rating} />
              <span className="products">{shop.products} Products</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default ShopCom;