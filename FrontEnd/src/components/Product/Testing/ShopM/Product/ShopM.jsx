import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { 
  fetchProducts, 
  setSortOption, 
  setFilterOptions, 
  filterProducts,
  setCurrentPage,
  resetFilters
} from '../../../../../Redux/productSlice';

import ProductCard from "../ProductCard/ProductCard";
import FilterDrawer from "../FilterDrawer/FilterDrawer";
import SortDropdown from "../SortDropdown/SortDropdown";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../../../../ui/Button";
import Pagination from "../Pagination/Pagination";
import "./ShopM.css";

const ITEMS_PER_PAGE = 15;

const Shop = () => {
  const dispatch = useDispatch();
  const { category, subcategory } = useParams();

  const { 
    filteredProducts, 
    sortOption, 
    filterOptions,
    currentPage
  } = useSelector(state => state.products);

  const productCount = filteredProducts ? filteredProducts.length : 0;
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagFromQuery = searchParams.get('tag');
  const sale = searchParams.get('sale');
  const storeFromQuery = searchParams.get('store');

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
      return `${storeFromQuery}'s Store`;
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
        newFilters.storeName = storeFromQuery;
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

  return (
    <div className="shop-container">
      <h1 className="shop-title">{getPageTitle()}</h1>

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

        <div className="sort-container-shopm">
          <span className="results-count results-count-full">Showing 1-{Math.min(15, productCount)} of {productCount} products</span>
          <span className="results-count results-count-short">1-{Math.min(15, productCount)} of {productCount}</span>
          <SortDropdown
            options={sortOptions}
            selectedOption={sortOption || sortOptions[0]}
            onOptionSelect={handleSort}
            showLabel={true} // Always show label
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
          <div className="product-grid-shopm">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
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
  );
};

export default Shop;