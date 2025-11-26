import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
});

const PRODUCTS_PER_PAGE = 5;

const updatedSortOptions = [
  { label: "Relevance", value: "default", direction: "asc" },
  { label: "Lowest Price", value: "price", direction: "asc" },
  { label: "Highest Price", value: "price", direction: "desc" },
  { label: "Top Customer Reviews", value: "rating", direction: "desc" },
  { label: "Most Recent", value: "id", direction: "desc" },
];

const initialState = {
  products: [],
  filteredProducts: [],
  sortOption: updatedSortOptions[0],
  filterOptions: {
    inStock: false,
    priceRange: [0, 2000],
    categories: [],
    subcategories: [],
    tags: [],
    categoryFilter: "",
    subcategoryFilter: "",
    minDiscount: null,
    storeName: "", // ✅ Updated field to storeName
  },
  currentPage: 1,
  itemsPerPage: PRODUCTS_PER_PAGE,
  updatedSortOptions,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSortOption(state, action) {
      state.sortOption = action.payload;
      state.currentPage = 1;
    },
    setFilterOptions(state, action) {
      state.filterOptions = { ...state.filterOptions, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.filterOptions = initialState.filterOptions;
      state.sortOption = updatedSortOptions[0];
      state.currentPage = 1;
    },

    filterProducts(state) {
      const { products, filterOptions, sortOption } = state;
      let filtered = [...products];

      // ✅ In stock filter
      if (filterOptions.inStock) {
        filtered = filtered.filter((p) => p.inStock === true);
      }

      // ✅ Price range filter
      let [minPrice, maxPrice] = filterOptions.priceRange;
      minPrice = minPrice || 0;
      maxPrice = maxPrice || 2000;

      filtered = filtered.filter(
        (p) => p.price >= minPrice && p.price <= maxPrice
      );

      // ✅ Apply category filters
      if (filterOptions.categories && filterOptions.categories.length > 0) {
        filtered = filtered.filter((p) =>
          filterOptions.categories.includes(p.category)
        );
      }
      
      // ✅ Category & subcategory filter
      if (filterOptions.categoryFilter) {
        const formattedCategory = filterOptions.categoryFilter.replace(/-/g, " ");
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === formattedCategory.toLowerCase()
        );

        if (filterOptions.subcategoryFilter) {
          const formattedSubcategory = filterOptions.subcategoryFilter.replace(
            /-/g,
            " "
          );
          filtered = filtered.filter(
            (p) =>
              p.subcategory.toLowerCase() === formattedSubcategory.toLowerCase()
          );
        }
      }

      // ✅ Store name filter (updated from sellerName)
      if (filterOptions.storeName) {
        filtered = filtered.filter(
          (p) =>
            p.storeName &&
            p.storeName.toLowerCase() === filterOptions.storeName.toLowerCase()
        );
      }

      // ✅ Tag-based filtering
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        const selectedTags = filterOptions.tags.map((t) => t.toLowerCase());
        filtered = filtered.filter((p) =>
          p.tags.some((tag) => selectedTags.includes(tag.toLowerCase()))
        );
      }

      // ✅ Min discount filter logic (sale products)
      if (filterOptions.minDiscount) {
        filtered = filtered.filter(
          (p) =>
            p.discountPercentage &&
            Number(p.discountPercentage) >= filterOptions.minDiscount
        );
      }

      // ✅ Sorting
      if (sortOption?.value !== "default") {
        const { value, direction } = sortOption;

        if (value === "name") {
          filtered.sort((a, b) =>
            direction === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          );
        } else {
          filtered.sort((a, b) =>
            direction === "asc" ? a[value] - b[value] : b[value] - a[value]
          );
        }
      }

      state.filteredProducts = filtered;
      state.currentPage = 1; // reset to first page after filter
    },

    setPaginatedProducts(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      state.paginatedProducts = state.filteredProducts.slice(
        start,
        start + state.itemsPerPage
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSortOption,
  setFilterOptions,
  resetFilters,
  filterProducts,
  setCurrentPage,
  setPaginatedProducts,
} = productSlice.actions;

export default productSlice.reducer;