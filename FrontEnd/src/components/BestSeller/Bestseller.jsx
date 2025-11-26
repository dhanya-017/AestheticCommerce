import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {  ChevronLeft, ChevronRight } from "lucide-react";
import "./Bestseller.css";

const bestSellers = [
  {
    storeName: "Deco House",
    image: "https://images.unsplash.com/photo-1727767579145-75908780ba04?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    storeName: "Dukaanzo",
    image: "https://images.unsplash.com/photo-1640715787152-9c49964804ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGR1a2FuJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    storeName: "Light shop",
    image: "https://images.unsplash.com/photo-1638866085618-eca6495ba576?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    storeName: "Desihaat",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    storeName: "Calligrapher",
    image: "https://images.unsplash.com/photo-1562102132-3572dba04f0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FMTElHUkFQSEVSfGVufDB8fDB8fHww",
  },
];

const BestSellers = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
  const { current } = containerRef;
  if (current) {
    const cardWidth = current.offsetWidth / 3; // width of 1 card
    if (direction === "left") {
      current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    } else {
      current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }
};


  const handleClick = (storeName) => {
    navigate(`/shops?store=${encodeURIComponent(storeName)}`);
    // navigate(`/products?store=${encodeURIComponent(storeName)}`);

  };

  return (
    <section className="best-sellers-section">
      <h2 className="best-sellers-title">The Best Sellers</h2>
      <div className="slider-wrapper">
      <button className="arrow left" onClick={() => scroll("left")}>
          {/* &#8249; */}
          <ChevronLeft size={24} />
        </button>

        <div className="slider" ref={containerRef}>
          {bestSellers.map((item, index) => (
            <div className="seller-card" key={index} onClick={() => handleClick(item.storeName)}>
              <div className="image-wrapper">
                <img src={item.image} alt={item.storeName} />
                <div className="shop-details">
                  <p>{item.storeName}</p>
                  <span>Click for more info</span>
                </div>
              </div>
              <p>{item.storeName}</p>
            </div>
          ))}
        </div>
         <button className="arrow right" onClick={() => scroll("right")}>
          {/* &#8250; */}
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default BestSellers;