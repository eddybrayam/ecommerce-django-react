// src/main.jsx
import './index.css';

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import TechStoreHomepage from "./pages/TechStoreHomepage.jsx";
import Login from "./pages/Login.jsx";
import RegisterClient from "./pages/RegisterClient.jsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <Routes>
      <Route path="/" element={<TechStoreHomepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registerClient" element={<RegisterClient />} />
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
