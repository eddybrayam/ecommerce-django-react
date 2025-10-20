// src/pages/AgotadoPage.jsx
import React, { useState } from "react";
import Agotado from "../components/Agotado/Agotado";

const AgotadoPage = () => {
  const [cantidad, setCantidad] = useState(1);
  const stock = 3; // ejemplo, puedes traerlo desde tu API

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Samsung Galaxy Z Fold5</h1>
      <p className="text-gray-700 mb-2">Stock disponible: {stock}</p>

      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(parseInt(e.target.value))}
        className="border p-2 w-20 mr-2 text-center"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => console.log("Intentando agregar al carrito")}
      >
        Agregar al carrito
      </button>

      {/* Aquí mostramos el componente de alerta */}
      <Agotado stock={stock} cantidad={cantidad} />
    </div>
  );
};

export default AgotadoPage;
