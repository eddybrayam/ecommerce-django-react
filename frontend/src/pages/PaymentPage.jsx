// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import "./PaymentPage.css";

export default function PaymentPage() {
  const { cartItems, total, clearCart } = useCart();
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <div className="payment-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1 className="success-title">
            ¡Pago realizado con éxito!
          </h1>
          <p className="success-message">
            Gracias por tu compra. Tu pedido está siendo procesado.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="success-button"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* 🧾 Resumen de compra */}
        <div className="order-summary">
          <h2 className="section-title">
            <span className="icon">🛍️</span>
            Resumen de tu pedido
          </h2>
          
          <div className="items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="item-price">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>
                S/ {(total / 1.18).toFixed(2)}{" "}
                <span className="igv-note">(sin IGV)</span>
              </span>
            </div>
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>S/ {(total - total / 1.18).toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span className="total-amount">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 💳 Sección de pago */}
        <div className="payment-section">
          <h2 className="section-title">
            <span className="icon">💳</span>
            Realizar pago
          </h2>

          <div className="payment-form-wrapper">
            <PaymentModal
              cartItems={cartItems}
              total={total}
              onClose={() => {}}
              onSuccess={() => {
                clearCart();
                setPaid(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}