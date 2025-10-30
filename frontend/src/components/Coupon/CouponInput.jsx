// src/components/Coupon/CouponInput.jsx
import { useState } from "react";
import axios from "axios";
import "./CouponInput.css";

export default function CouponInput({ total, onDiscountApplied }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/coupon/", {
        code,
        total,
      });

      if (response.data.valid) {
        setIsValid(true);
        setMessage(
          `Cupón aplicado: -S/ ${response.data.discount.toFixed(2)}`
        );

        // 🟢 AGREGADO: guardar descuento en localStorage para usar en el PDF
        const discountData = {
          code: code,
          discountPercent: response.data.discount_percent || 0,
          discountAmount: response.data.discount || 0,
          totalAfterDiscount: response.data.new_total || total,
        };
        localStorage.setItem("discountData", JSON.stringify(discountData));
        // 🔹 Fin del bloque agregado

        onDiscountApplied(response.data.new_total);
      } else {
        setIsValid(false);
        setMessage("Cupón inválido o expirado.");
      }
    } catch (error) {
      console.error("Error al validar cupón:", error);
      setIsValid(false);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Error al validar el cupón.");
      }
    }
  };

  return (
    <div className="coupon-section">
      <label htmlFor="coupon-code" className="coupon-label">
        Aplicar cupón
      </label>
      <div className="coupon-input-row">
        <input
          type="text"
          id="coupon-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingrese su código"
          className="coupon-input"
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          className="coupon-button"
        >
          Aplicar
        </button>
      </div>
      {message && (
        <p className={`coupon-message ${isValid ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
