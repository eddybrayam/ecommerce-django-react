import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

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

    const clearCart = () => setCartItems([]);

    const total = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <CartContext.Provider
        value={{ cartItems, addToCart, removeFromCart, clearCart, total }}
        >
        {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
