// src/api/api.js
import axios from "axios";

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
