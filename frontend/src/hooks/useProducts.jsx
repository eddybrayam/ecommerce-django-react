// ✅ src/hooks/useProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener productos desde el backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/products/`);

      // 🔍 Ver qué datos devuelve tu backend (puedes ver esto en la consola)
      console.log("📦 Productos desde API:", res.data.results || res.data);

      const data = res.data.results || res.data;

      // 🔧 Transformar productos para asegurar que tengan un ID correcto
      const formatted = data.map((p) => ({
        id: p.id || p.producto_id || p.producto?.id, // 👈 siempre habrá un id
        name: p.nombre || p.name || p.producto?.nombre || "Producto sin nombre",
        price: parseFloat(p.precio || p.price || p.producto?.precio || 0),
        image:
          p.imagen_url ||
          p.image ||
          p.producto?.imagen_url ||
          "/placeholder-product.jpg",
        category: p.categoria || p.category || p.producto?.categoria || null,
        inStock: p.stock !== undefined ? p.stock > 0 : true,
      }));

      setProducts(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refreshProducts: fetchProducts };
};
