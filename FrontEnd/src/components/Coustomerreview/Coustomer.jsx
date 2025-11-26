import React from "react";
import "./Coustomer.css";

const reviews = [
  {
    name: "Alex Gardener",
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600", // You can replace with an actual image URL
    rating: 5,
    review:
      "The products are lit and I really enjoyed the gift sent to me through your website. They were perfect!",
  },
  {
    name: "Ria Sharma",
    img: "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lybHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.5,
    review:
      "Absolutely loved the decor items. Smooth delivery and great packaging!",
  },
  {
    name: "Ali Faisal",
    img: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    review:
      "Amazing selection of gifts. Will definitely come back for more!",
  },
  {
    name: "John Doe",
    img: "https://images.pexels.com/photos/262391/pexels-photo-262391.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4,
    review:
      "Amazing selection of gifts. Will definitely come back for more!",
  },
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="stars">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>⭐</span>
      ))}
      {halfStar && <span key="half">⭐️</span>}
    </div>
  );
};

const TestimonialCard = ({ name, img, rating, review }) => {
  return (
    <div className="customer-review-card">
      <img
        src={img || "https://via.placeholder.com/100"}
        alt={name}
        className="profile-img"
      />
      <h3>{name}</h3>
      <StarRating rating={rating} />
      <p>
        {review} <span className="read-more">read more</span>
      </p>
    </div>
  );
};

const Customer = () => {
  return (
    <section className="customer-review-section">
      <div className="customer-review-header">
        <h2>WHY TO CHOOSE US?</h2>
        <p className="reviews-link">Here Are Our Genuine Reviews</p>
      </div>
      <div className="customer-review-container">
        {reviews.map((review, index) => (
          <TestimonialCard key={index} {...review} />
        ))}
      </div>
    </section>
  );
};

export default Customer;

