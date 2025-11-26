import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Scrollsection.css";

const ScrollSection = () => {
  const scrollRef = useRef(null);

  const items = [
    { title: "Paper Craft", img: "https://images.unsplash.com/photo-1513726214296-1f2e95e452d8?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Wedding Gift", img: "https://plus.unsplash.com/premium_photo-1661631110461-7baeff9c440f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Anniversary Gift", img: "https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { title: "Baby Shower", img: "https://plus.unsplash.com/premium_photo-1677654190250-e9a946a29a5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFieSUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D" },
    { title: "Festive Gift", img: "https://images.pexels.com/photos/6679634/pexels-photo-6679634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Valentine Gift", img: "https://images.pexels.com/photos/4041240/pexels-photo-4041240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Graduation", img: "https://images.pexels.com/photos/7842995/pexels-photo-7842995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Corporate Gift", img: "https://images.pexels.com/photos/6207753/pexels-photo-6207753.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { title: "Custom Art", img: "https://images.pexels.com/photos/6397610/pexels-photo-6397610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { title: "Thank You", img: "https://images.unsplash.com/photo-1503980599186-9cc36eda351a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGhhbmslMjAlMjB5b3V8ZW58MHx8MHx8fDA%3D" },
  ];

  useEffect(() => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth;
    let intervalId;

    const autoScroll = () => {
      if (container) {
        if (container.scrollLeft + scrollAmount >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    };

    intervalId = setInterval(autoScroll, 8000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="scroll-wrapper">
      <h6 className="scroll-heading">
        SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP - SHOP
      </h6>
      <h6 className="mobile-scroll-heading">
        SHOP - SHOP - SHOP - SHOP - SHOP
      </h6>

      <div className="scroll-container" ref={scrollRef}>
        {items.map((item, i) => (
          <Link
            key={i}
            to={`/products?tag=${encodeURIComponent(item.title)}`}
            className="scroll-card"
          >
            <div className="scroll-item">
              <img src={item.img} alt={item.title} className="scroll-image" />
            </div>
            <p className="item-text">{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScrollSection;