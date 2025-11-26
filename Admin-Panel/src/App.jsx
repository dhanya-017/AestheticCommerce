import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/LoginPage/LoginPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import SellersPage from '../pages/SellerPage/SellerPage';
import SellerProductsPage from '../pages/SellerProductsPage/SellerProductsPage';
import ProductsPage from '../pages/ProductPage/ProductPage';
import ReportsPage from '../pages/ReportsPage/ReportsPage';
import AnalyticsPage from '../pages/AnalyticsPage/AnalyticsPage';
import GlobalSearchPage from '../pages/GlobalSearchPage/GlobalSearchPage';
import ContactMessagesPage from '../pages/ContactMessagesPage/ContactMessagesPage';
import SellerDetailsPage from '../pages/SellerDetailsPage/SellerDetailsPage';

import AdminLayout from '../src/layouts/AdminLayout';
import { Toaster } from 'react-hot-toast';

const App = () => {

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:5001/api/admin/verify', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) setIsAdmin(true);
          else localStorage.removeItem('adminToken');
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    verifyAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAdmin ? <Navigate to="/" /> : <LoginPage setIsAdmin={setIsAdmin} />
          }
        />

        {/* All Admin Routes Wrapped inside AdminLayout */}
        <Route
          path="/"
          element={
            isAdmin ? (
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/sellers"
          element={
            isAdmin ? (
              <AdminLayout>
                <SellersPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/sellers/:sellerId/products"
          element={
            isAdmin ? (
              <AdminLayout>
                <SellerProductsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/products"
          element={
            isAdmin ? (
              <AdminLayout>
                <ProductsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/reports"
          element={
            isAdmin ? (
              <AdminLayout>
                <ReportsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/analytics"
          element={
            isAdmin ? (
              <AdminLayout>
                <AnalyticsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/search"
          element={
            isAdmin ? (
              <AdminLayout>
                <GlobalSearchPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/seller/:sellerId"
          element={ 
            isAdmin ? (
              <AdminLayout>
                <SellerDetailsPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/contact-messages"
          element={
            isAdmin ? (
              <AdminLayout>
                <ContactMessagesPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
