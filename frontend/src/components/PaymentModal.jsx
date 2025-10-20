// src/components/PaymentModal.jsx
import { useState } from "react";
// ⬇️ Seguimos usando tus endpoints existentes
import { pagarConTarjeta, pagarConYape, confirmarPago } from "../api/api"; // NUEVO: importar confirmarPago

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
        // Construimos el arreglo que usa el backend para crear el pedido
        const productos = cartItems.map((item) => ({
            id: item.id,
            cantidad: item.quantity,
        }));

        if (metodo === "tarjeta") {
            // 1) Mantiene tu flujo actual de tarjeta
            const res = await pagarConTarjeta(productos, tarjeta);
            setMensaje(res.data?.mensaje || "Pago con tarjeta aprobado");

            // 2) NUEVO: crea el pedido y dispara el correo en el backend
            await confirmarPago(productos);
            // 3) Devolvemos el control al caller (limpiar carrito / navegar)
            onSuccess?.();
        } else if (metodo === "yape") {
            // 1) Mantiene tu flujo actual de Yape
            const formData = new FormData();
            formData.append("producto_id", cartItems[0].id); // (tu lógica original)
            formData.append("monto", total);
            formData.append("comprobante", comprobante);
            const res = await pagarConYape(formData);
            setMensaje(res.data?.mensaje || "Pago Yape recibido");

            // 2) NUEVO: crea el pedido y dispara el correo en el backend
            await confirmarPago(productos);
            // 3) Callback original
            onSuccess?.();
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
            <p>
            Total: <strong>S/ {total.toFixed(2)}</strong>
            </p>

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
                    onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Mes (MM)"
                    value={tarjeta.mes}
                    onChange={(e) => setTarjeta({ ...tarjeta, mes: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Año (YYYY)"
                    value={tarjeta.anio}
                    onChange={(e) => setTarjeta({ ...tarjeta, anio: e.target.value })}
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
