import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './Store/store';

import Mainpage from '../pages/Mainpage';
import Layout from "./components/Layouts/Layout";
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/Loginpage/LoginPage';
import AddProductPage from '../pages/AddProductPage';
import SellerProfilePage from '../pages/ProfilePage';
import StatisticsPage from '../pages/Stats';
import Order from '../pages/OrdersPage';
import Inventory from '../pages/Inventory';
import CustomerInsightsSec from '../pages/CustomerInsights';
import Settings from '../pages/Settings';
import ProductDetailPage from '../pages/ProductViewpage/ProductDetailPage';
import ScrollToTop from './components/ScrollToTop'; 
import ProductsPage from '../pages/ProductPage/ProductPage';
import HelpCenter from '../pages/seller-support/HelpCenter';
import ShippingPolicy from '../pages/seller-support/ShippingPolicy';
import Faq from '../pages/seller-support/Faq';
import TermsOfService from '../pages/seller-support/TermsOfService';
import PrivacyPolicy from '../pages/seller-support/PrivacyPolicy';
import RefundPolicy from '../pages/seller-support/RefundPolicy';
import ContactPage from '../pages/ContactPage';

import MyProducts from '../pages/MyProducts/MyProducts';
import MySubmissionsPage from '../pages/MySubmissionsPage/MySubmissionsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* ScrollToTop listens to route changes */}
        <ScrollToTop />

        <Routes>
          <Route element={<Layout />}></Route>
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Mainpage />} />
          <Route path="/addProduct" element={<AddProductPage />} />
          <Route path="/seller/profile" element={<SellerProfilePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<CustomerInsightsSec />} />
           <Route path="/contact" element={<ContactPage />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard/product/:id" element={<ProductDetailPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/my-submissions" element={<MySubmissionsPage />} />


           {/* Seller Support Pages */}
          <Route path="/seller-support/help-center" element={<HelpCenter />} />
          <Route path="/seller-support/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/seller-support/faq" element={<Faq />} />
          <Route path="/seller-support/terms-of-service" element={<TermsOfService />} />
          <Route path="/seller-support/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/seller-support/refund-policy" element={<RefundPolicy />} />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;