import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "./ui/toaster/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { useDispatch } from "react-redux";
import { logoutUser } from "../src/Redux/authSlice.js";
import authService from "../src/Redux/authService.js";

import Homepage from "../pages/homepage";
import Productpage from "../pages/productpage";
import Loginpage from "../pages/Loginpage";
import Registerpage from "../pages/Registerpage";
import Contactpage from "../pages/contactpage";
import Blog from "../pages/blogpage";
import Profile from "../pages/profilepage";
import Cartpage from "../pages/cartpage";
import ShopPage from "../pages/shoppage";
import ProductDetails from "./components/Product/Testing/ProductDetails/ProductDetails.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import SellerHandler from "../src/components/SellerPages/Handler.jsx";
import BlogDetails from "./components/Blog/BlogDetails/BlogDetails.jsx";
import ShopDetails from "./components/ShopDetails/ShopDetails.jsx";
import Order from "./components/Order/Checkout/Checkout.jsx";
import OrderPlaced from "./components/Order/OrderPlaced/OrderPlaced.jsx";
import OrderList from "./components/Order/OrderList/OrderList.jsx";
import OrderDetails from "./components/Order/OrderDetails/OrderDetails.jsx";
import AddressList from "./components/Address/AddressList/AddressList.jsx";
import FavoritesPage from "./components/Favorites/FavoritesPage.jsx";
import { useCartPersistence } from "./hooks/useCartPersistence";

function App() {
  const dispatch = useDispatch();
  useCartPersistence();

  // ✅ Validate session on app load
  useEffect(() => {
    const validateSession = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      try {
        const serverBootTime = await authService.checkServerStatus();
        if (storedUser.bootTime !== serverBootTime) {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error("Session validation failed:", error);
      }
    };

    validateSession();
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Productpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/contact" element={<Contactpage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/seller" element={<SellerHandler />} />
        <Route path="/sale" element={<Productpage />} />
        <Route path="/shops" element={<ShopPage />} />
        <Route path="/shop-products" element={<ShopDetails />} />

        {/* Order Routes */}
        <Route path="/order-checkout" element={<Order />} />
        <Route path="/OrderList" element={<OrderList />} />
        <Route path="/order_Details" element={<OrderDetails />} />
        <Route path="/order_details" element={<OrderDetails />} />
        <Route
          path="/order-placed/:orderNumber"
          element={<OrderPlaced />}
        />

        {/* Address Routes */}
        <Route path="/AddressList" element={<AddressList />} />

        {/* Blog Routes */}
        <Route path="/blogs/:id" element={<BlogDetails />} />

        {/* Product Routes */}
        <Route path="/:category" element={<Productpage />} />
        <Route path="/:category/:subcategory" element={<Productpage />} />
        <Route
          path="/:category/:subcategory/:productName"
          element={<ProductDetails />}
        />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;
