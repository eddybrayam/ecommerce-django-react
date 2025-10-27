// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import "./PaymentPage.css";

// Impots para PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";// <-- ¡ESTA ES LA LÍNEA CRÍTICA QUE FALTA O ES INCORRECTA!


export default function PaymentPage() {
  const { cartItems, total, clearCart } = useCart();
  const [paid, setPaid] = useState(false);

  // ✅ 2. Nuevo estado para guardar los datos del pedido ANTES de limpiar el carrito
  const [completedOrder, setCompletedOrder] = useState(null);

  // ✅ Función generatePDF corregida
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
      
      doc.text("Cliente: Varios", 20, 60);
      doc.text("DNI/RUC: -", 20, 65);

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

      // ✅ ¡AQUÍ ESTÁ EL CAMBIO!
      // Se llama a autoTable() como función, pasando 'doc'
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        headStyles: { fillColor: [37, 99, 235] },
      });

      // --- Totales ---
      // No te preocupes, 'doc.autoTable.previous.finalY' seguirá funcionando
      // porque autoTable() modifica el objeto 'doc' que le pasaste.
      const finalY = doc.lastAutoTable.finalY;
      const subtotal = orderTotal / 1.18;
      const igv = orderTotal - subtotal;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text("Subtotal:", 140, finalY + 10, { align: "right" });
      doc.text(`S/ ${subtotal.toFixed(2)}`, 190, finalY + 10, { align: "right" });

      doc.text("IGV (18%):", 140, finalY + 17, { align: "right" });
      doc.text(`S/ ${igv.toFixed(2)}`, 190, finalY + 17, { align: "right" });

      doc.setFontSize(14);
      doc.text("TOTAL:", 140, finalY + 25, { align: "right" });
      doc.text(`S/ ${orderTotal.toFixed(2)}`, 190, finalY + 25, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("¡Gracias por su compra!", 105, finalY + 40, { align: "center" });

      doc.save(`comprobante-${storeName}-${new Date().getTime()}.pdf`);
      console.log("PDF generado y descarga iniciada.");

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el comprobante. Por favor, revisa la consola.");
    }
  };

  // ✅ 4. Pantalla de pago exitoso (MODIFICADA)
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
          
          {/* --- NUEVOS BOTONES --- */}
          <div className="success-actions">
            <button
              onClick={() => (window.location.href = "/")}
              className="success-button secondary" // Botón secundario
            >
              Volver al inicio
            </button>
            <button
              onClick={generatePDF} // Llama a la función de generar PDF
              className="success-button" // Botón principal
            >
              Descargar Comprobante (PDF)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Página de Pago (sin cambios, excepto 'onSuccess') ---
  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* 🧾 Resumen de compra (sin cambios) */}
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
                  <p className="item-quantity">
                    Cantidad: {item.quantity}
                  </p>
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
            <div className="total-row final-total">
              <span>Total:</span>
              <span className="total-amount">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 💳 Sección de pago */}
        <div className="payment-section">
          <h2 className="section-title">
            <span className="icon">💳</span>
            Realizar pago
          </h2>
          <div className="payment-form-wrapper">
            <PaymentModal
              cartItems={cartItems}
              total={total}
              onClose={() => {}}
              onSuccess={() => {
                // ✅ 5. Lógica de 'onSuccess' ACTUALIZADA
                // Guardamos los datos ANTES de limpiar el carrito
                setCompletedOrder({ items: cartItems, orderTotal: total });
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