// src/pages/Checkout.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">
          <span className="title-icon">🛒</span>
          Resumen de compra
        </h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛍️</div>
            <p className="empty-message">Tu carrito está vacío</p>
            <button 
              onClick={() => navigate("/")}
              className="back-button"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x {item.quantity}</span>
                  </div>
                  <span className="item-total">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="total-section">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>S/ {(total / 1.18).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>IGV (18%):</span>
                <span>S/ {(total - total / 1.18).toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total a pagar:</span>
                <span className="total-amount">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="payment-button"
            >
              <span>Continuar al pago</span>
              <span className="arrow">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}