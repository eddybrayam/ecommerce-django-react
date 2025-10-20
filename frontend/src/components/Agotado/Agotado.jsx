// src/components/Agotado/Agotado.jsx
import React from "react";

const Agotado = ({ stock, cantidad }) => {
  // Mostrar cuando ya no hay unidades
  if (stock === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mt-4">
        <strong className="font-bold">Producto agotado 😢</strong>
        <p>No tenemos unidades disponibles actualmente.</p>
      </div>
    );
  }

  // Mostrar aviso si el usuario pidió más de lo disponible
  if (cantidad > stock) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative text-center mt-4">
        <strong className="font-bold">Aviso ⚠️</strong>
        <p>Solo quedan {stock} unidades disponibles.</p>
      </div>
    );
  }

  // Si todo está OK, no mostrar nada
  return null;
};

export default Agotado;
