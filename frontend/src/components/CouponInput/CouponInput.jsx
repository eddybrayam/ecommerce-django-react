// src/components/CouponInput/CouponInput.jsx
import { useState } from "react";
import { useCoupon } from "../../context/CouponContext";
import "./CouponInput.css";

export default function CouponInput({ cartTotal }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const { applyCoupon, appliedCoupon } = useCoupon();

  const handleApply = () => {
    if (!code.trim()) {
      setMessage("⚠️ Ingrese un código de cupón");
      return;
    }

    const result = applyCoupon(code, cartTotal);
    setMessage(result.message);
  };

  return (
    <div className="coupon-input">
      <label htmlFor="coupon-code">Ingrese cupón:</label>
      <input
        id="coupon-code"
        type="text"
        placeholder="Ejemplo: DESC10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleApply}>Aplicar</button>

      {message && (
        <p
          className={`coupon-message ${
            appliedCoupon ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

