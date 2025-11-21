// src/api/api.js
import axios from "axios";
import api from "../services/api"; 
const API_URL = "http://127.0.0.1:8000/api";

export const pagarConTarjeta = async (productos, tarjeta) => {
    return axios.post(`${API_URL}/pagos/orden/tarjeta/`, {
        productos,
        tarjeta_numero: tarjeta.numero,
        tarjeta_mes: tarjeta.mes,
        tarjeta_anio: tarjeta.anio,
        tarjeta_cvc: tarjeta.cvc,
    });
};

export const pagarConYape = async (formData) => {
    return axios.post(`${API_URL}/pagos/yape/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};


// --- NUEVO: confirmar pedido y enviar correo en backend ---
export const confirmarPago = (productos,cupon) =>
  api.post("/api/payments/confirm/", { productos,cupon });


// 🟨 =========================
// 🟨 RESEÑAS Y CALIFICACIONES
// 🟨 =========================

// 🔹 Obtener reseñas de un producto
export const getProductReviews = async (productId) => {
  const res = await axios.get(`${API_URL}/products/${productId}/reviews/`);
  return res.data;
};

// 🔹 Crear o actualizar reseña del usuario autenticado
export const createOrUpdateReview = async (productId, payload, token) => {
  const res = await axios.post(`${API_URL}/products/${productId}/reviews/`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// 🔹 Eliminar reseña propia
export const deleteMyReview = async (productId, token) => {
  const res = await axios.delete(`${API_URL}/products/${productId}/reviews/mine/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
  
};


// usando el cliente axios "api" que ya tienes con baseURL = backend
export const sendSupportMessage = (payload) => {
  return api.post("/support/contact/", payload); // 👈 sin /api
};