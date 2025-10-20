import api from "../../services/api"; // tu axios con baseURL y auth

export const getMyOrders = () => api.get("/api/orders/mine/");
export const getOrder = (id) => api.get(`/api/orders/mine/${id}/`);
