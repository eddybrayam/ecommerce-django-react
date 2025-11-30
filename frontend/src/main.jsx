//main.jsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // 🔹 AÑADIR ESTO
import { FavoritesProvider } from "./context/FavoritesContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
);