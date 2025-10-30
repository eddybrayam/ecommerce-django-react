// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import "./PaymentPage.css";

// Imports para PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

// 🟢 Importar el componente del cupón
import CouponInput from "../components/Coupon/CouponInput";

// ✅ 1. ARRAY DE USUARIOS DE EJEMPLO
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

  // 🟢 Nuevo estado para manejar descuento
  const [discountedTotal, setDiscountedTotal] = useState(total);

  // Función para manejar cuando se aplica un cupón
  const handleDiscountApplied = (newTotal) => {
    setDiscountedTotal(newTotal);
  };

  // ✅ 2. FUNCIÓN generatePDF MODIFICADA
  const generatePDF = () => {
    console.log("Iniciando generatePDF...");

    try {
      if (!completedOrder || !completedOrder.items || completedOrder.items.length === 0) {
        console.error("No hay datos del pedido (completedOrder) para generar el PDF.");
        alert("Error: No se encontraron datos del pedido para generar el comprobante.");
        return;
      }
      
      console.log("Datos del pedido:", completedOrder);

      const doc = new jsPDF();
      const { items, orderTotal } = completedOrder;

      // --- Configuración de la Tienda ---
      const storeName = "TechStore";
      const storeRUC = "20123456789";
      const storeAddress = "Av. Siempre Viva 123, Arequipa, Perú";
      // ---------------------------------

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(storeName, 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`RUC: ${storeRUC}`, 105, 28, { align: "center" });
      doc.text(storeAddress, 105, 33, { align: "center" });
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("COMPROBANTE DE PAGO", 105, 45, { align: "center" });

      const date = new Date().toLocaleDateString("es-PE");
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${date}`, 20, 55);
      
      // ✅ Cliente aleatorio
      const randomIndex = Math.floor(Math.random() * sampleCustomers.length);
      const randomCustomer = sampleCustomers[randomIndex];

      doc.text(`Cliente: ${randomCustomer.name}`, 20, 62);
      doc.text(`DNI: ${randomCustomer.dni}`, 20, 69); 

      // --- Tabla de Productos ---
      const tableColumn = ["Cant.", "Descripción", "P. Unit.", "Total"];
      const tableRows = [];

      items.forEach(item => {
        const itemData = [
          item.quantity,
          item.name,
          `S/ ${parseFloat(item.price).toFixed(2)}`,
          `S/ ${(parseFloat(item.price) * item.quantity).toFixed(2)}`
        ];
        tableRows.push(itemData);
      });

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

      // 🟢 NUEVO: mostrar descuento si se aplicó cupón
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
      console.log("PDF generado y descarga iniciada.");

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el comprobante. Por favor, revisa la consola.");
    }
  };

  // Pantalla de pago exitoso (sin cambios)
  if (paid) {
    return (
      <div className="payment-success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1 className="success-title">
            ¡Pago realizado con éxito!
          </h1>
          <p className="success-message">
            Gracias por tu compra. Tu pedido está siendo procesado.
          </p>
          <div className="success-actions">
            <button
              onClick={() => (window.location.href = "/")}
              className="success-button secondary"
            >
              Volver al inicio
            </button>
            <button
              onClick={generatePDF}
              className="success-button"
            >
              Descargar Comprobante (PDF)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Página de Pago
  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Resumen de compra */}
        <div className="order-summary">
          <h2 className="section-title">
            <span className="icon">🛍️</span>
            Resumen de tu pedido
          </h2>
          <div className="items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Cantidad: {item.quantity}</p>
                </div>
                <p className="item-price">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>
                S/ {(total / 1.18).toFixed(2)}{" "}
                <span className="igv-note">(sin IGV)</span>
              </span>
            </div>
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>S/ {(total - total / 1.18).toFixed(2)}</span>
            </div>

            {/* 🟢 Campo para ingresar cupón */}
            <CouponInput total={total} onDiscountApplied={handleDiscountApplied} />

            <div className="total-row final-total">
              <span>Total:</span>
              <span className="total-amount">
                S/ {discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de pago */}
        <div className="payment-section">
          <h2 className="section-title">
            <span className="icon">💳</span>
            Realizar pago
          </h2>
          <div className="payment-form-wrapper">
            <PaymentModal
              cartItems={cartItems}
              total={discountedTotal} // 🟢 total actualizado con cupón
              onClose={() => {}}
              onSuccess={() => {
                console.log("Pago exitoso. Guardando datos del pedido...");
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
  );
}