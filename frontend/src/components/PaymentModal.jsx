// src/components/PaymentModal.jsx
import { useState } from "react";
import { pagarConTarjeta, pagarConYape } from "../api/api";

export default function PaymentModal({ cartItems, total, onClose, onSuccess }) {
    const [metodo, setMetodo] = useState("tarjeta");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [tarjeta, setTarjeta] = useState({
        numero: "",
        mes: "",
        anio: "",
        cvc: "",
    });

    const [comprobante, setComprobante] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            if (metodo === "tarjeta") {
                const productos = cartItems.map((item) => ({
                    id: item.id,
                    cantidad: item.quantity,
                }));
                const res = await pagarConTarjeta(productos, tarjeta);
                setMensaje(res.data.mensaje);
                onSuccess();
            } else if (metodo === "yape") {
                const formData = new FormData();
                formData.append("producto_id", cartItems[0].id); // por simplicidad
                formData.append("monto", total);
                formData.append("comprobante", comprobante);
                const res = await pagarConYape(formData);
                setMensaje(res.data.mensaje);
                onSuccess();
            }
        } catch (err) {
            setMensaje(err.response?.data?.error || "Error procesando pago");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Pagar Pedido</h2>
                <p>Total: <strong>S/ {total.toFixed(2)}</strong></p>

                <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="yape">📱 Yape / Plin</option>
                </select>

                <form onSubmit={handleSubmit}>
                    {metodo === "tarjeta" && (
                        <div className="tarjeta-fields">
                            <input
                                type="text"
                                placeholder="Número de tarjeta"
                                value={tarjeta.numero}
                                onChange={(e) =>
                                    setTarjeta({ ...tarjeta, numero: e.target.value })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Mes (MM)"
                                value={tarjeta.mes}
                                onChange={(e) =>
                                    setTarjeta({ ...tarjeta, mes: e.target.value })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Año (YYYY)"
                                value={tarjeta.anio}
                                onChange={(e) =>
                                    setTarjeta({ ...tarjeta, anio: e.target.value })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                value={tarjeta.cvc}
                                onChange={(e) => setTarjeta({ ...tarjeta, cvc: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {metodo === "yape" && (
                        <div className="yape-fields">
                            <label>Subir comprobante:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setComprobante(e.target.files[0])}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Procesando..." : "Confirmar pago"}
                    </button>
                </form>

                {mensaje && <p className="message">{mensaje}</p>}

                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}
