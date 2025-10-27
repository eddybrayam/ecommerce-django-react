// src/context/CouponContext.jsx
import { createContext, useContext, useState } from "react";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // ✅ Lista de cupones válidos
  const coupons = {
    DESC10: { discount: 0.10, description: "10% de descuento en tu compra" },
    PRIMERA: { discount: 0.15, description: "15% de descuento por primera compra" },
    VERANO5: { discount: 0.05, description: "Descuento especial de verano" },
  };

  // 🧠 Aplicar cupón
  const applyCoupon = (code, total) => {
    const upperCode = code.trim().toUpperCase();

    if (coupons[upperCode]) {
      const { discount } = coupons[upperCode];
      setAppliedCoupon(upperCode);
      setDiscount(discount);
      setDiscountAmount(total * discount); // ✅ Evita NaN
      return { success: true, message: "Cupón aplicado correctamente" };
    } else {
      setAppliedCoupon(null);
      setDiscount(0);
      setDiscountAmount(0);
      return { success: false, message: "Cupón no válido o expirado" };
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setDiscountAmount(0);
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        discount,
        discountAmount,
        applyCoupon,
        clearCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => useContext(CouponContext);
