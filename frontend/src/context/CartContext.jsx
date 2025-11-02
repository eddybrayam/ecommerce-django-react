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
  const [ready, setReady] = useState(false); // 👈 evita guardar antes de leer

  // 🔹 Calcular total automáticamente
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  // 🔹 Guardar carrito solo después de haber cargado
  useEffect(() => {
    if (ready) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      setReady(true);
    }
  }, [cartItems, ready]);

  // ✅ Actualizado: respeta cantidad seleccionada desde el producto
  const addToCart = (product) => {
    setCartItems((prev) => {
      const itemExists = prev.find((p) => p.id === product.id);
      if (itemExists) {
        // si ya existe, suma la cantidad enviada (product.quantity)
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + (product.quantity || 1) }
            : p
        );
      }
      // si no existe, lo agrega con la cantidad seleccionada
      return [...prev, { ...product, quantity: product.quantity || 1 }];
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

// Hook personalizado
export const useCart = () => useContext(CartContext);
