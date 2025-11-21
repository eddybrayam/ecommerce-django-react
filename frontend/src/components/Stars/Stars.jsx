// src/components/Stars/Stars.jsx
import React from "react";
import "./Stars.css";


const Stars = ({ value = 0, size = 20, showNumber = true }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="stars-container" style={{ fontSize: `${size}px` }}>
      {"★".repeat(fullStars)}
      {hasHalfStar && <span className="half">★</span>}
      {"☆".repeat(emptyStars)}
      {showNumber && (
        <span className="stars-number">
          {" "}
          {value ? value.toFixed(1) : "0.0"}/5
        </span>
      )}
    </div>
  );
};

export default Stars;
