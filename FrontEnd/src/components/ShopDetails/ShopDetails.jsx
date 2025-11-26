import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import { ArrowLeft, Star } from 'lucide-react';

import { 
  fetchProducts, 
  setSortOption, 
  setFilterOptions, 
  filterProducts,
  setCurrentPage,
  resetFilters
} from '../../Redux/productSlice.js';

import ProductCard from "../Product/Testing/ShopM/ProductCard/ProductCard.jsx";
import FilterDrawer from "../Product/Testing/ShopM/FilterDrawer/FilterDrawer.jsx";
import SortDropdown from "../Product/Testing/ShopM/SortDropdown/SortDropdown.jsx";
import RatingStars from "../Product/RatingStars/RatingStars.jsx";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../ui/Button.jsx";
import Pagination from "../Product/Testing/ShopM/Pagination/Pagination.jsx";
import Footersec from "../Footersection/Footersection.jsx";
import "./ShopDetails.css";

const ITEMS_PER_PAGE = 15;

const ShopDetails = () => {
  const dispatch = useDispatch();
  const { category, subcategory } = useParams();

  const { 
    filteredProducts, 
    sortOption, 
    filterOptions,
    currentPage,
    products
  } = useSelector(state => state.products);

  const productCount = filteredProducts ? filteredProducts.length : 0;
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagFromQuery = searchParams.get('tag');
  const sale = searchParams.get('sale');
  const storeFromQuery = searchParams.get('store');
  
  // Debug URL parameters
  console.log('location.search:', location.search);
  console.log('searchParams:', searchParams);
  console.log('storeFromQuery from URL:', storeFromQuery);

  const getPageTitle = () => {
    if (sale === "true") return "Sale Products";
    if (tagFromQuery) {
      const formattedTag = tagFromQuery
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return `${formattedTag}`;
    }
    if (storeFromQuery) {
      return `${storeFromQuery}`;
    }
    if (subcategory) {
      return `${subcategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
    }
    if (category) {
      return `${category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
    }
    return "All Products";
  };

  const sortOptions = [
    { label: 'Relevance', value: 'default', direction: 'asc' },
    { label: 'Lowest Price', value: 'price', direction: 'asc' },
    { label: 'Highest Price', value: 'price', direction: 'desc' },
    { label: 'Top Customer Reviews', value: 'rating', direction: 'desc' },
    { label: 'Most Recent', value: 'id', direction: 'desc' },
  ];

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(fetchProducts()).then(() => {
      const newFilters = { tags: [] };

      if (sale === "true") {
        newFilters.minDiscount = 40;
      }

      if (tagFromQuery) {
        newFilters.tags = [tagFromQuery.toLowerCase()];
      }

              if (storeFromQuery) {
          newFilters.storeName = decodeURIComponent(storeFromQuery);
        }

      if (category) {
        newFilters.categoryFilter = category.replace(/-/g, " ");
      } else {
        newFilters.categoryFilter = "";
      }

      if (subcategory) {
        newFilters.subcategoryFilter = subcategory.replace(/-/g, " ");
      } else {
        newFilters.subcategoryFilter = "";
      }

      dispatch(setFilterOptions(newFilters));
      dispatch(filterProducts());
      dispatch(setCurrentPage(1));
    });
  }, [dispatch, tagFromQuery, category, subcategory, sale, storeFromQuery]);
  
  const handleSort = (option) => {
    dispatch(setSortOption(option));
    dispatch(filterProducts());
    dispatch(setCurrentPage(1));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilterOptions(newFilters));
    dispatch(filterProducts());
    dispatch(setCurrentPage(1));
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Function to get shop information from product data
  const getShopInfo = () => {
    // Decode the store name from URL
    const decodedStoreName = storeFromQuery ? decodeURIComponent(storeFromQuery) : '';
    
    console.log('getShopInfo - storeFromQuery:', storeFromQuery);
    console.log('getShopInfo - decodedStoreName:', decodedStoreName );
    console.log('getShopInfo - products length:', products ? products.length : 'null');
    
    if (!decodedStoreName || !products || products.length === 0) {
      console.log('getShopInfo - returning default shop info');
      return {
        name: decodedStoreName  || 'Shop',
        location: 'Location',
        rating: 4.5,
        products: productCount,
        icon: '🏪'
      };
    }

    // Find products for this specific store
    const storeProducts = products.filter(product => 
      product.storeName && product.storeName.toLowerCase() === decodedStoreName.toLowerCase()
    );

    if (storeProducts.length === 0) {
      console.log('getShopInfo - no store products found, returning shop info with 0 products');
      return {
        name: decodedStoreName,
        location: 'Location',
        rating: 4.5,
        products: 0,
        icon: '🏪'
      };
    }

    // Calculate average rating
    const totalRating = storeProducts.reduce((sum, product) => sum + (product.rating || 0), 0);
    const averageRating = storeProducts.length > 0 ? (totalRating / storeProducts.length).toFixed(1) : 4.5;

    // Get seller name from first product
    const sellerName = storeProducts[0]?.sellerName || 'Seller';

    console.log('getShopInfo - found store products, returning shop info with products');
    console.log('getShopInfo - final name:', decodedStoreName);
    
    return {
      name: decodedStoreName,
      location: `${sellerName} Seller`,
      rating: parseFloat(averageRating),
      products: storeProducts.length,
      icon: '🏪'
    };
  };

  const shopInfo = getShopInfo();
  
 

  return (
    <div>
      <Navbar />
      <div className="shop-container">
       
        {/* Shop Header */}
        {storeFromQuery && (
          <div className="shop-header">
            <div className="shop-info-header">
              <div className="shop-icon-name">
                <span className="shop-icon">{shopInfo.icon}</span>
                <div className="shop-details">
                
                  <h1 className="shop-name" >ffddad
                    {shopInfo.name || 'Unknown Shop'}
                  </h1>
                  <h3></h3>
                  {/* <p className="shop-location">{shopInfo.location}</p> */}
                  
                </div>
              </div>
              <div className="shop-stats-header">
                <div className="rating-display">
                <h1 className="shop-name" >
                    {shopInfo.name || 'Unknown Shop'} Store
                    <p className="shop-location">{shopInfo.location || 'Unknown Shop'}</p>
                    
                  </h1>
                  <RatingStars rating={shopInfo.rating} />
                  <span className="products-count">{shopInfo.products} Products</span>
                </div>
                
              </div>
            </div>
            <Link to="/shops" className="back-button">
              <ArrowLeft size={16} />
              <span>Back to Shops</span>
            </Link>
          </div>
        )}

        <div className="shop-toolbar">
          <div className="filter-button-container">
            <Button
              variant="outline"
              className="filter-button"
              onClick={() => setShowFilterDrawer(true)}
            >
              <SlidersHorizontal size={16} className="filter-icon" />
              <span>Filters</span>
            </Button>
          </div>

          <div className="sort-container">
            <span className="results-count">Showing 1-{Math.min(15, productCount)} of {productCount} products</span>
            <SortDropdown
              options={sortOptions}
              selectedOption={sortOption || sortOptions[0]}
              onOptionSelect={handleSort}
            />
          </div>
        </div>

        <FilterDrawer
          open={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />

        <div className="products-container">
          {currentProducts.length === 0 ? (
            <div className="no-products">
              <h3>No products match your filters</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="product-grid">
              {currentProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        )}
      </div>
      <Footersec/>
    </div>
  
  );
  
};

export default ShopDetails;