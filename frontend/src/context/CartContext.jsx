// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/cart/`, { withCredentials: true });
      const data = res.data;
      // Transform backend items to frontend shape expected by your components
      const items = (data.items || []).map((it) => ({
        id: it.product.id,                 // uses product.id
        producto_id: it.product.producto_id || it.product.id,
        name: it.product.nombre || it.product.name || it.product.title,
        price: parseFloat(it.product.precio || it.product.price || 0),
        image: it.product.imagen_url || it.product.image || "/placeholder-product.jpg",
        quantity: it.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add to cart -> call backend and then refresh cart
  const addToCart = async (product, qty = 1) => {
    try {
      await axios.post(
        `${API}/api/cart/add/`,
        { product_id: product.id ?? product.producto_id ?? product.producto_id, quantity: qty },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post(`${API}/api/cart/remove/`, { product_id: productId }, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${API}/api/cart/clear/`, {}, { withCredentials: true });
      await fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const total = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total, loading, refresh: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
