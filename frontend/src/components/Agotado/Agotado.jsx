// src/components/Agotado/Agotado.jsx
import React from "react";
import "./Agotado.css";

export default function Agotado({ stock, cantidad }) {
  const disponible = stock - cantidad;

  if (stock === 0) {
    return <p className="agotado-text">❌ Producto agotado</p>;
  }

  if (disponible < 0) {
    return (
      <p className="agotado-text warning">
        ⚠️ Solo quedan {stock} unidades disponibles.
      </p>
    );
  }

  return (
    <p className="stock-text">
      ✅ En stock: <strong>{disponible}</strong> unidades disponibles
    </p>
  );
}

