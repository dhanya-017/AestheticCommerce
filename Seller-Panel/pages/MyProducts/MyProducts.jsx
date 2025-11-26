import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyProducts.module.css';
import Layout from '../../src/components/Layouts/Layout';

const BASE_URL = import.meta.env.VITE_API_URL;

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('sellerToken');
        const response = await axios.get(`${BASE_URL}/api/seller/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading your products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Layout>
      <div className={styles.container}>
        <h1>My Products</h1>
      {products.length === 0 ? (
        <p>You haven't added any products yet.</p>
      ) : (
        <div className={styles.productList}>
          {products.map(product => (
            <div key={product._id} className={styles.productCard}>
              <img src={product.images[0]} alt={product.name} className={styles.productImage} />
              <div className={styles.productDetails}>
                <h3>{product.name}</h3>
                <p><strong>Status:</strong> 
                  <span className={`${styles.status} ${styles[product.approvalStatus]}`}>
                    {product.approvalStatus}
                  </span>
                </p>
                {product.approvalStatus === 'rejected' && product.adminNotes && (
                  <p className={styles.rejectionReason}><strong>Reason:</strong> {product.adminNotes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </Layout>
  );
};

export default MyProducts;