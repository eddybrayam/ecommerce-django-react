// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PaymentPage.css";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cupón
import CouponInput from "../components/Coupon/CouponInput";

// Clientes de ejemplo
const sampleCustomers = [
  { name: "Juan Pérez García", dni: "71234567" },
  { name: "María López Rodríguez", dni: "72345678" },
  { name: "Carlos Sánchez Quispe", dni: "73456789" },
  { name: "Ana Torres Mendoza", dni: "74567890" },
  { name: "Luis Gonzales Flores", dni: "75678901" },
];

export default function PaymentPage() {
  const { cartItems, total, clearCart } = useCart();

  const [paid, setPaid] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [discountedTotal, setDiscountedTotal] = useState(total);

  // cuando se aplica cupón
  const handleDiscountApplied = (newTotal) => {
    setDiscountedTotal(newTotal);
  };

  // =========================
  // Generar comprobante PDF
  // =========================
  const generatePDF = () => {
    try {
      if (!completedOrder || !completedOrder.items || completedOrder.items.length === 0) {
        alert("Error: No se encontraron datos del pedido para generar el comprobante.");
        return;
      }

      const doc = new jsPDF();
      const { items, orderTotal } = completedOrder;

      const storeName = "TechStore";
      const storeRUC = "20123456789";
      const storeAddress = "Av. Siempre Viva 123, Arequipa, Perú";

      // Cabecera tienda
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(storeName, 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`RUC: ${storeRUC}`, 105, 28, { align: "center" });
      doc.text(storeAddress, 105, 33, { align: "center" });

      // Título comprobante
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("COMPROBANTE DE PAGO", 105, 45, { align: "center" });

      // Fecha
      const date = new Date().toLocaleDateString("es-PE");
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${date}`, 20, 55);

      // Cliente aleatorio
      const randomCustomer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
      doc.text(`Cliente: ${randomCustomer.name}`, 20, 62);
      doc.text(`DNI: ${randomCustomer.dni}`, 20, 69);

      // Tabla de productos
      const tableColumn = ["Cant.", "Descripción", "P. Unit.", "Total"];
      const tableRows = items.map((item) => [
        item.quantity,
        item.name,
        `S/ ${parseFloat(item.price).toFixed(2)}`,
        `S/ ${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        headStyles: { fillColor: [37, 99, 235] },
      });

      const finalY = doc.lastAutoTable.finalY;
      const subtotal = orderTotal / 1.18;
      const igv = orderTotal - subtotal;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal:", 140, finalY + 10, { align: "right" });
      doc.text(`S/ ${subtotal.toFixed(2)}`, 190, finalY + 10, { align: "right" });

      doc.text("IGV (18%):", 140, finalY + 17, { align: "right" });
      doc.text(`S/ ${igv.toFixed(2)}`, 190, finalY + 17, { align: "right" });

      // Descuento por cupón
      const discountData = JSON.parse(localStorage.getItem("discountData") || "{}");
      let discountTextY = finalY + 25;

      if (discountData.code && discountData.discountAmount > 0) {
        doc.text(
          `Descuento (${discountData.code} -${discountData.discountPercent || 0}%):`,
          140,
          discountTextY,
          { align: "right" }
        );
        doc.text(
          `-S/ ${discountData.discountAmount.toFixed(2)}`,
          190,
          discountTextY,
          { align: "right" }
        );
        discountTextY += 8;
      }

      const totalFinal = discountData.totalAfterDiscount || orderTotal;

      doc.setFontSize(14);
      doc.text("TOTAL:", 140, discountTextY + 8, { align: "right" });
      doc.text(`S/ ${totalFinal.toFixed(2)}`, 190, discountTextY + 8, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("¡Gracias por su compra!", 105, discountTextY + 25, { align: "center" });

      doc.save(`comprobante-${storeName}-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el comprobante. Revisa la consola.");
    }
  };

  // =========================
  // Pantalla de pago exitoso
  // =========================
  if (paid) {
    return (
      <>
        <Navbar />
        <div className="payment-page">
          <div className="payment-success-wrapper">
            <div className="success-card">
              <div className="success-icon-circle">
                <svg className="success-checkmark" viewBox="0 0 52 52">
                  <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path
                    className="success-checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>

              <h1 className="success-title">¡Pago realizado con éxito!</h1>
              <p className="success-message">
                Gracias por tu compra. Tu pedido está siendo procesado y recibirás una
                confirmación por correo electrónico.
              </p>

              <div className="success-order-number">
                <span className="order-label">Número de orden:</span>
                <span className="order-value">
                  #{new Date().getTime().toString().slice(-8)}
                </span>
              </div>

              <div className="success-actions">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn-secondary"
                >
                  <span className="btn-icon">🏠</span>
                  Volver al inicio
                </button>
                <button onClick={generatePDF} className="btn-primary">
                  <span className="btn-icon">📄</span>
                  Descargar Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // =========================
  // Página de pago principal
  // =========================
  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="payment-header">
          <div className="container">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Inicio</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item">Carrito</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Pago</span>
            </div>
            <h1 className="page-title">Finalizar compra</h1>
          </div>
        </div>

        <div className="payment-container">
          <div className="payment-content">
            {/* Columna izquierda: resumen */}
            <div className="order-summary-section">
              <div className="order-summary-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span className="title-icon">🛍️</span>
                    Resumen de tu pedido
                  </h2>
                  <span className="items-count">
                    {cartItems.length} {cartItems.length === 1 ? "artículo" : "artículos"}
                  </span>
                </div>

                <div className="items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-quantity">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="item-price-wrapper">
                        <p className="item-price">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider" />

                <div className="totals-section">
                  <div className="total-row">
                    <span className="total-label">Subtotal</span>
                    <span className="total-value">
                      S/ {(total / 1.18).toFixed(2)}
                    </span>
                  </div>
                  <div className="total-row">
                    <span className="total-label">IGV (18%)</span>
                    <span className="total-value">
                      S/ {(total - total / 1.18).toFixed(2)}
                    </span>
                  </div>

                  {/* Cupón de descuento */}
                  <div className="coupon-section">
                    <CouponInput total={total} onDiscountApplied={handleDiscountApplied} />
                  </div>

                  <div className="summary-divider final-divider" />

                  <div className="total-row final-total">
                    <span className="total-label-final">Total a pagar</span>
                    <span className="total-amount">
                      S/ {discountedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="security-badge">
                  <span className="badge-icon">🔒</span>
                  <span className="badge-text">Pago 100% seguro</span>
                </div>
              </div>
            </div>

            {/* Columna derecha: formulario de pago */}
            <div className="payment-form-section">
              <div className="payment-form-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <span className="title-icon">💳</span>
                    Información de pago
                  </h2>
                </div>

                <div className="payment-methods-info">
                  <p className="methods-text">Aceptamos los siguientes métodos de pago:</p>
                  <div className="payment-icons">
                    <span className="payment-icon">💳</span>
                    <span className="payment-icon">🏦</span>
                    <span className="payment-icon">📱</span>
                  </div>
                </div>

                <div className="payment-form-wrapper">
                  <PaymentModal
                    cartItems={cartItems}
                    total={discountedTotal}
                    onClose={() => {}}
                    onSuccess={() => {
                      setCompletedOrder({
                        items: cartItems,
                        orderTotal: discountedTotal,
                      });
                      clearCart();
                      setPaid(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
