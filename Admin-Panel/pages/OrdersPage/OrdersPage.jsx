import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersPage.css';
import Pagination from '../../src/component/Pagination/Pagination';

const API = import.meta.env.VITE_API_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${API}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    const sellerNames = [...new Set(order.products.map(p => p.sellerId?.name).filter(Boolean))].join(', ').toLowerCase();
    const sellerIds = [...new Set(order.products.map(p => p.sellerId?._id).filter(Boolean))].join(', ').toLowerCase();

    return (
      order.orderId?.toLowerCase().includes(searchTermLower) ||
      sellerNames.includes(searchTermLower) ||
      sellerIds.includes(searchTermLower)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page">
      <h1>All Orders</h1>
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by Order ID, Seller Name, or Seller ID..."
          className="local-search-input"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Sellers</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Delivery Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map(order => {
            const sellerNames = [...new Set(order.products.map(p => p.sellerId?.name).filter(Boolean))].join(', ');
            return (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{sellerNames || 'N/A'}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.deliveryStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={filteredOrders.length}
      />
    </div>
  );
};

export default OrdersPage;
