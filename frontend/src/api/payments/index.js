import api from "../../services/api";

export const confirmarPago = (productos) =>
    api.post("/api/payments/confirm/", { productos });
