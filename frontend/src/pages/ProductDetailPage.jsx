import React, { useState } from "react";
import Agotado from "../components/Agotado/Agotado";

const ProductDetailPage = ({ producto }) => {
  // ejemplo de props o datos del backend
  const [cantidad, setCantidad] = useState(1);

  const handleChange = (e) => {
    setCantidad(Number(e.target.value));
  };

  const stock = producto.stock; // o desde API

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} className="rounded-xl mb-4 w-80" />

      <p className="text-lg font-semibold mb-2">Precio: S/ {producto.precio}</p>
      <p className="text-sm text-gray-600 mb-2">Stock disponible: {stock}</p>

      <input
        type="number"
        value={cantidad}
        min="1"
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-1 w-20"
      />

      {/* Aquí mostramos el aviso */}
      <Agotado stock={stock} cantidadSolicitada={cantidad} />

      <button
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        disabled={stock <= 0}
      >
        {stock <= 0 ? "Agotado" : "Agregar al carrito"}
      </button>
    </div>
  );
};

export default ProductDetailPage;



