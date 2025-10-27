import React from "react";
import "./Agotado.css"; // opcional si quieres estilo

export default function Agotado({ stock, cantidadSolicitada }) {
  if (stock <= 0) {
    return <p className="agotado-alert">🛑 Producto agotado</p>;
  }

  if (cantidadSolicitada > stock) {
    return (
      <p className="agotado-warning">
        ⚠️ Solo quedan {stock} unidades disponibles
      </p>
    );
  }

  return null;
}

