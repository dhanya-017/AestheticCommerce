import React, { useEffect, useState } from 'react';
import './Checkout.css';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Address from '../../Address/AddressUI/Address';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAddresses, createAddress } from '../../../Redux/addressSlice';
import { clearCartFromBackend } from '../../../Redux/cartSlice';
import { createOrder } from '../../../Redux/orderSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, totalAmount } = useSelector(state => state.cart);
  const { addresses, loading } = useSelector(state => state.addresses);
  const { user, token } = useSelector(state => state.user);

  // Check if this is a buy now flow
  const isBuyNow = location.state?.isBuyNow;
  const buyNowProduct = location.state?.buyNowProduct;

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    dispatch(fetchAddresses());
  }, [dispatch, user, token, navigate]);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI apps' },
    { id: 'netbanking', name: 'Internet Banking', icon: '🏦', description: 'All major banks supported' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💰', description: 'Pay when you receive' }
  ];

  // Totals - handle both cart and buy now scenarios
  const subtotal = isBuyNow ? (buyNowProduct.price * buyNowProduct.quantity) : totalAmount;
  const shipping = 0;
  const taxes = Math.ceil(subtotal * 0.18);
  const total = subtotal + shipping; // without taxes

  const handleAddressSubmit = async (addressData) => {
    try {
      const res = await dispatch(createAddress(addressData)).unwrap();
      setSelectedAddressId(res._id);
      setShowAddressForm(false);
    } catch (e) {}
  };

  const selectedAddressObj = addresses.find(a => a._id === selectedAddressId) || (addresses[0] || null);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      // Create order data for backend - handle both cart and buy now scenarios
      const orderData = {
        products: isBuyNow ? [{
          product: buyNowProduct.id,
          quantity: buyNowProduct.quantity,
          price: buyNowProduct.price
        }] : cartItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: {
          fullName: selectedAddressObj.name,
          phone: selectedAddressObj.phone,
          street: `${selectedAddressObj.address}, ${selectedAddressObj.locality}`,
          city: selectedAddressObj.city,
          state: selectedAddressObj.state,
          pincode: selectedAddressObj.pincode
        }
      };

      // Create order in backend
      const createdOrder = await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart from backend after successful order (only if not buy now)
      if (!isBuyNow) {
        await dispatch(clearCartFromBackend()).unwrap();
      }
      
      // Use the actual MongoDB order ID from the backend response
      const orderNumber = createdOrder._id;
      const paymentMethodName = paymentMethods.find(method => method.id === selectedPayment)?.name || selectedPayment;

      // Delivery window
      const deliveryStartDate = new Date();
      deliveryStartDate.setDate(deliveryStartDate.getDate() + 7);
      const deliveryEndDate = new Date();
      deliveryEndDate.setDate(deliveryEndDate.getDate() + 9);
      const estimatedDelivery = `${deliveryStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${deliveryEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

      navigate(`/order-placed/${orderNumber}`, {
        state: {
          orderDetails: {
            orderNumber,
            orderDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }),
            estimatedDelivery,
            status: 'Order Confirmed',
            transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
            products: isBuyNow ? [buyNowProduct] : cartItems,
            shippingAddress: selectedAddressObj ? {
              name: selectedAddressObj.name,
              phone: selectedAddressObj.phone,
              address: `${selectedAddressObj.address}, ${selectedAddressObj.locality}, ${selectedAddressObj.city}, ${selectedAddressObj.state} ${selectedAddressObj.pincode}`,
              type: selectedAddressObj.addressType || 'home'
            } : null,
            paymentMethod: { id: selectedPayment, name: paymentMethodName },
            orderSummary: { subtotal, shipping, taxes, total }
          }
        }
      });
    } catch (error) {
      console.error('Failed to clear cart after order:', error);
      // Still navigate to success page even if cart clearing fails
      const orderNumber = `ord#${Math.floor(100000 + Math.random() * 900000)}`;
      navigate(`/order-placed/${orderNumber}`, {
        state: {
          orderDetails: {
            orderNumber,
            orderDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }),
            estimatedDelivery: 'January 22-24, 2025',
            status: 'Order Confirmed',
            transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
            products: cartItems,
            shippingAddress: selectedAddressObj ? {
              name: selectedAddressObj.name,
              phone: selectedAddressObj.phone,
              address: `${selectedAddressObj.address}, ${selectedAddressObj.locality}, ${selectedAddressObj.city}, ${selectedAddressObj.state} ${selectedAddressObj.pincode}`,
              type: selectedAddressObj.addressType || 'home'
            } : null,
            paymentMethod: { id: selectedPayment, name: paymentMethods.find(method => method.id === selectedPayment)?.name || selectedPayment },
            orderSummary: { subtotal, shipping, taxes, total }
          }
        }
      });
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper" style={{padding: '2rem', textAlign: 'center'}}>
          <div className="loading-spinner" />
          <p>Loading your addresses...</p>
        </div>
      </div>
    );
  }

  if (showAddressForm) {
    return (
      <div className="address-form-overlay">
        <div className="address-form-container">
          <div className="address-form-header">
            <button onClick={() => setShowAddressForm(false)} className="back-to-checkout-btn">
              <i className="fas fa-arrow-left"></i>
              Back to Checkout
            </button>
          </div>
          <Address onAddressSubmit={handleAddressSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-grid">
          {/* Left Column - Shipping & Payment */}
          <div className="checkout-main">
            {/* Address Section */}
            <div className="checkout-section">
              <h2 className="section-title">Shipping Address</h2>
              {addresses.length === 0 ? (
                <button onClick={() => setShowAddressForm(true)} className="add-address-btn">
                  <i className="fas fa-plus add-icon"></i>
                  <p className="add-text">Add Shipping Address</p>
                  <p className="add-subtext">Click to add your delivery address</p>
                </button>
              ) : (
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`address-item ${selectedAddressId === address._id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(address._id)}
                    >
                      <div className="address-content">
                        <div className="address-header">
                          <span className="address-name">{address.name}</span>
                          <span className="address-type-badge">{address.addressType || 'home'}</span>
                        </div>
                        <p className="address-phone">{address.phone}</p>
                        <p className="address-details">{address.address}, {address.locality}, {address.city}, {address.state} {address.pincode}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowAddressForm(true); }}
                        className="edit-address-btn"
                      >
                        <span>Edit</span>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setShowAddressForm(true)} className="add-another-btn">
                    <i className="fas fa-plus"></i>
                    <span>Add Another Address</span>
                  </button>
                </div>
              )}
            </div>

            {/* Payment Methods Section */}
            <div className="checkout-section">
              <h2 className="section-title">Payment Options</h2>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div key={method.id} className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`} data-payment={method.id}>
                    <label className="payment-method-label">
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id} 
                        checked={selectedPayment === method.id} 
                        onChange={(e) => setSelectedPayment(e.target.value)} 
                        className="hidden-radio" 
                      />
                      <div className="payment-method-content">
                        {/* <div className="payment-radio">
                          {selectedPayment === method.id && <div className="radio-dot"></div>}
                        </div> */}
                        <div className="payment-info1">
                          <span className="payment-icon">{method.icon}</span>
                          <div>
                            <p className="payment-name">{method.name}</p>
                            <p className="payment-description">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    {/* Payment Method Details */}
                    
                    {/* {selectedPayment === method.id && (
                      <div className="payment-form">
                        {method.id === 'card' && (
                          <div className="form-fields">
                            <div className="form-field">
                              <label className="form-label">Card Number</label>
                              <input type="text" className="form-input" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div className="form-row">
                              <div className="form-field">
                                <label className="form-label">Expiry Date</label>
                                <input type="text" className="form-input" placeholder="MM/YY" />
                              </div>
                              <div className="form-field">
                                <label className="form-label">CVV</label>
                                <input type="text" className="form-input" placeholder="123" />
                              </div>
                            </div>
                            <div className="form-field">
                              <label className="form-label">Card Holder Name</label>
                              <input type="text" className="form-input" placeholder="John Doe" />
                            </div>
                          </div>
                        )}
                        
                        {method.id === 'upi' && (
                          <div className="form-fields">
                            <div className="form-field">
                              <label className="form-label">UPI ID</label>
                              <input type="text" className="form-input" placeholder="username@upi" />
                            </div>
                            <div className="form-field">
                              <label className="form-label">Mobile Number</label>
                              <input type="text" className="form-input" placeholder="+91 98765 43210" />
                            </div>
                          </div>
                        )}
                        
                        {method.id === 'netbanking' && (
                          <div className="form-fields">
                            <div className="form-field">
                              <label className="form-label">Select Bank</label>
                              <select className="form-input">
                                <option value="">Choose your bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                              </select>
                            </div>
                          </div>
                        )} */}
                        
                        {/* {method.id === 'cod' && (
                          <div className="form-fields">
                            <div className="cod-message">
                              <p>💡 You can pay with cash when your order is delivered.</p>
                              <p>No additional charges for cash on delivery.</p>
                            </div>
                          </div>
                        )} */}
                      {/* </div>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              {/* {isBuyNow && (
                <div className="buy-now-indicator">
                  <span className="buy-now-badge">Buy Now</span>
                  <p className="buy-now-text">Purchasing this item directly</p>
                </div>
              )} */}
              <h2 className="section-title">Order Summary</h2>

              {/* Cart Items or Buy Now Product */}
              <div className="cart-items-summary">
                {isBuyNow ? (
                  <div key={buyNowProduct.id} className="product-item2">
                    <div className="product-image1">
                      <img src={buyNowProduct.image} alt={buyNowProduct.name} className="product-img1" />
                    </div>
                    <div className="product-details1">
                      <h3 className="product-name">{buyNowProduct.name}</h3>
                      <div className="product-meta">
                        <span className="product-quantity">Qty: {buyNowProduct.quantity}</span>
                        <span className="product-price">₹{(buyNowProduct.price * buyNowProduct.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.productId} className="product-item2">
                      <div className="product-image1">
                        <img src={item.image} alt={item.title} className="product-img1" />
                      </div>
                      <div className="product-details1">
                        <h3 className="product-name">{item.title}</h3>
                        <div className="product-meta">
                          <span className="product-quantity">Qty: {item.quantity}</span>
                          <span className="product-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount Code */}
              <div className="discount-section">
                <div className="discount-input-group">
                  <input type="text" placeholder="Discount code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="discount-input" />
                  <button className="discount-btn">Apply</button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Shipping <i className="fas fa-info-circle info-icon"></i></span>
                  <span className="price-value">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="price-total">
                  <div className="total-row">
                    <span className="total-label">Total</span>
                    <div className="total-amount">
                      <div className="total-value">₹{total.toFixed(2)}</div>
                      <div className="tax-info">Including ₹{taxes.toFixed(2)} in taxes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                disabled={(addresses.length === 0 && !selectedAddressObj) || !selectedPayment}
                className={`place-order-btn1 ${selectedAddressObj && selectedPayment ? 'active' : 'disabled'}`}
                onClick={handlePlaceOrder}
              >
                <i className="fas fa-lock"></i>
                Place Order • ₹{total.toFixed(2)}
              </button>
              <p className="security-note">Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;