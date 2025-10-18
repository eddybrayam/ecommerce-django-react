// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cargar carrito al iniciar (una sola vez)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error cargando carrito:", err);
      return [];
    }
  });

  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false); // 👈 para evitar escribir antes de tiempo

  // 🔹 Calcular total
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  // 🔹 Guardar carrito cuando ya se haya leído
  useEffect(() => {
    if (ready) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      // la primera vez solo marca que ya cargó, no guarda nada
      setReady(true);
    }
  }, [cartItems, ready]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const itemExists = prev.find((p) => p.id === product.id);
      if (itemExists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
