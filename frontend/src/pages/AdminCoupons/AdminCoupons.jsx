import React, { useState } from "react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercent: 0,
    expiresAt: "",
    minAmount: 0,
  });

  const handleAdd = () => {
    setCoupons([...coupons, newCoupon]);
    setNewCoupon({ code: "", discountPercent: 0, expiresAt: "", minAmount: 0 });
  };

  return (
    <div className="admin-coupons">
      <h2>Administrar Cupones</h2>

      <div className="new-coupon">
        <input
          placeholder="Código"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />
        <input
          type="number"
          placeholder="% Descuento"
          value={newCoupon.discountPercent}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, discountPercent: e.target.value })
          }
        />
        <input
          type="date"
          value={newCoupon.expiresAt}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Monto mínimo"
          value={newCoupon.minAmount}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, minAmount: e.target.value })
          }
        />
        <button onClick={handleAdd}>Agregar cupón</button>
      </div>

      <ul>
        {coupons.map((c, i) => (
          <li key={i}>
            {c.code} - {c.discountPercent}% - vence {c.expiresAt}
          </li>
        ))}
      </ul>
    </div>
  );
}
