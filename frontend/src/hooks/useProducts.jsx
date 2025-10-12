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
      setProducts(res.data.results || res.data);
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
