// src/components/PromoCarousel/PromoCarousel.jsx
import { useState, useEffect } from "react";
import "./PromoCarousel.css";

const PromoCarousel = ({ images = [], autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [images.length, autoPlay, interval]);

  return (
    <section className="promo-carousel">
      <div className="promo-inner">
        {/* Flecha izquierda */}
        {images.length > 1 && (
          <button
            type="button"
            className="promo-arrow left"
            onClick={prevSlide}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        {/* Imagen actual */}
        <div className="promo-slide">
          <img
            src={images[current]}
            alt={`Banner ${current + 1}`}
            className="promo-image"
            onError={(e) => {
              e.currentTarget.style.opacity = 0;
            }}
          />
        </div>

        {/* Flecha derecha */}
        {images.length > 1 && (
          <button
            type="button"
            className="promo-arrow right"
            onClick={nextSlide}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="promo-dots">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`promo-dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PromoCarousel;
