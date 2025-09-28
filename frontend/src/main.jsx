// src/main.jsx
import './index.css';

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import TechStoreHomepage from "./pages/TechStoreHomepage.jsx";
import Login from "./pages/Login.jsx";
import RegisterClient from "./pages/RegisterClient.jsx";
import Activate from "./pages/Activate.jsx";   // ✅ aseguramos extensión y ruta correcta
// si luego decides usar VerifyEmail con query params, lo agregamos aquí también

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <Routes>
      <Route path="/" element={<TechStoreHomepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterClient />} />   {/* ✅ más consistente */}
      <Route path="/activate/:uidb64/:token" element={<Activate />} /> {/* ✅ correo → frontend */}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
