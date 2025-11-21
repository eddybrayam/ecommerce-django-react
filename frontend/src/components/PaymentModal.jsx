// src/components/PaymentModal.jsx
import { useState } from "react";
import { pagarConTarjeta, pagarConYape, confirmarPago } from "../api/api";
import "./PaymentModal.css";

export default function PaymentModal({ cartItems, total, onSuccess, onClose }) {
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
  const [cuponAplicado, setCuponAplicado] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const productos = cartItems.map((item) => ({
        id: item.id,
        cantidad: item.quantity,
      }));

      if (metodo === "tarjeta") {
        const res = await pagarConTarjeta(productos, tarjeta);
        setMensaje(res.data?.mensaje || "Pago con tarjeta aprobado");

        await confirmarPago(productos, cuponAplicado);
        onSuccess?.();
      } else if (metodo === "yape") {
        const formData = new FormData();
        formData.append("producto_id", cartItems[0].id);
        formData.append("monto", total);
        formData.append("comprobante", comprobante);

        const res = await pagarConYape(formData);
        setMensaje(res.data?.mensaje || "Pago Yape recibido");

        await confirmarPago(productos, cuponAplicado);
        onSuccess?.();
      }
    } catch (err) {
      setMensaje(err?.response?.data?.error || "Error procesando pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay-form">
      <p className="pay-form-total">
        Total a pagar: <span>S/ {total.toFixed(2)}</span>
      </p>

      {/* Selector de método */}
      <div className="pay-form-group">
        <label htmlFor="metodo">Método de pago</label>
        <select
          id="metodo"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        >
          <option value="tarjeta">💳 Tarjeta</option>
          <option value="yape">📱 Yape / Plin</option>
        </select>
      </div>

      <form className="pay-form-body" onSubmit={handleSubmit}>
        {metodo === "tarjeta" && (
          <>
            <div className="pay-form-group">
              <label>Número de tarjeta</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={tarjeta.numero}
                onChange={(e) =>
                  setTarjeta({ ...tarjeta, numero: e.target.value })
                }
                required
              />
            </div>

            <div className="pay-form-row">
              <div className="pay-form-group small">
                <label>Mes (MM)</label>
                <input
                  type="text"
                  placeholder="MM"
                  value={tarjeta.mes}
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, mes: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pay-form-group small">
                <label>Año (YYYY)</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={tarjeta.anio}
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, anio: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pay-form-group small">
                <label>CVC</label>
                <input
                  type="text"
                  placeholder="CVC"
                  value={tarjeta.cvc}
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, cvc: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </>
        )}

        {metodo === "yape" && (
          <div className="pay-form-group">
            <label>Subir comprobante (imagen)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setComprobante(e.target.files[0])}
              required
            />
          </div>
        )}

        <div className="pay-form-group">
          <label>Código de cupón (opcional)</label>
          <input
            type="text"
            placeholder="Ej: SMART10"
            value={cuponAplicado}
            onChange={(e) => setCuponAplicado(e.target.value)}
          />
        </div>

        {mensaje && <p className="pay-form-message">{mensaje}</p>}

        <div className="pay-form-actions">
          {onClose && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Procesando..." : "Confirmar pago"}
          </button>
        </div>
      </form>
    </div>
  );
}
