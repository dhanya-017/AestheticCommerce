import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  decreaseQuantity,
  addToCartWithBackendSync,
  clearCart,
} from "../../Redux/cartSlice";
import "./Cart.css";


const CartPage = () => {
  const navigate = useNavigate();
  const { category, subcategory, productName } = useParams();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  if (cartItems.length === 0) return <h2>Your cart is empty!</h2>;

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2 className="cart-title">Shopping Cart</h2>
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-image-details-mobile">
              <img src={item.image} alt={item.title} />
              <div className="cart-details-mobile">
                <h4>{item.title}</h4>
                <p>₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="cart-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(decreaseQuantity(item.productId));
                }}
              >
                -
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await dispatch(
                      addToCartWithBackendSync({
                        id: item.productId,
                        name: item.title,
                        price: item.price,
                        image: item.image,
                        category: item.category,
                        subcategory: item.subcategory,
                      })
                    ).unwrap();
                  } catch (error) {
                    console.error("Failed to update cart:", error);
                  }
                }}
              >
                +
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeFromCart(item.productId));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-summary-title">Summary</div>
        <div className="cart-total">Total: ₹{totalAmount}</div>
        <button
          className="clear-cart-btn"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
        <button
          className="place-order-btn"
          onClick={() => navigate("/order-checkout")}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;