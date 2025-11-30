// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error leyendo favorites de localStorage", e);
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Error guardando favorites en localStorage", e);
    }
  }, [favorites]);

  const isFavorite = (productId) =>
    favorites.some((p) => p.id === productId);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        // Si ya está, quitar
        return prev.filter((p) => p.id !== product.id);
      }
      // Si no está, agregar
      return [...prev, product];
    });
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, favoritesCount }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
