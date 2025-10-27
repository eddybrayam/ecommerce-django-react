// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// 🔧 Normalizador seguro de precios y cantidades
const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const cleaned = String(v).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

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
  const [ready, setReady] = useState(false); // 👈 evita escribir antes de tiempo

  // 🔹 Calcular total
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      const price = toNumber(item.price);
      const qty = Number.isFinite(Number(item.quantity))
        ? Number(item.quantity)
        : 0;
      return sum + price * qty;
    }, 0);
    setTotal(newTotal);
  }, [cartItems]);

  // 🔹 Guardar carrito cuando ya se haya leído
  useEffect(() => {
    if (ready) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      // primera vez solo marca que ya cargó
      setReady(true);
    }
  }, [cartItems, ready]);

  // 🛒 Agregar producto al carrito + reducir stock localmente
  const addToCart = (product) => {
    const safeProduct = {
      ...product,
      price: toNumber(product.price),
      quantity: Number(product.quantity) || 1,
    };

    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === safeProduct.id);

      // 🔸 Si el producto ya existe en el carrito
      if (existing) {
        const newQuantity = existing.quantity + safeProduct.quantity;

        // 🚫 No permitir agregar más de lo que hay en stock
        if (newQuantity > safeProduct.stock) {
          alert(`Solo quedan ${safeProduct.stock} unidades disponibles`);
          return prev;
        }

        return prev.map((p) =>
          p.id === safeProduct.id
            ? {
                ...p,
                quantity: newQuantity,
                stock: p.stock - safeProduct.quantity,
              }
            : p
        );
      }

      // 🔸 Si es nuevo, lo agregamos con el stock actualizado
      return [
        ...prev,
        { ...safeProduct, stock: safeProduct.stock - safeProduct.quantity },
      ];
    });
  };

  // 🗑️ Eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  // ♻️ Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
