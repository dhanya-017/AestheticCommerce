import React from "react";
import "./salesection.css";
import { useNavigate } from "react-router-dom";

const SaleSection = () => {
  const navigate = useNavigate();

 const handleClick = () => {
  navigate("/sale?sale=true"); // Add query param
};

  return (
    <><div className="salesection-wrapper">
      <div className="sale-heading-line">
        SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE - SALE
      </div>
      <div className="mobile-sale-heading-line">
        SALE - SALE - SALE - SALE - SALE 
      </div>
      <div className="sale-banner-box" onClick={handleClick}>
        <h2>Big Sale! Up to 50% OFF</h2>
        <p>Tap to explore amazing discounts on gifts and decor</p>
      </div>
      </div>
    </>
  );
};

export default SaleSection;