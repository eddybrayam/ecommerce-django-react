import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (order) => {
  const discountData = JSON.parse(localStorage.getItem("discountData") || "{}");
  const doc = new jsPDF();

  doc.text("Número de Pedido", 10, 10);
  doc.text(`#${order.id}`, 60, 10);

  doc.text("Estado", 10, 20);
  doc.text(order.status || "Pendiente", 60, 20);

  doc.text("Detalles del Pedido", 10, 35);

  const tableData = order.items.map((item) => [
    item.name,
    item.quantity,
    `S/ ${item.price.toFixed(2)}`,
  ]);

  doc.autoTable({
    startY: 40,
    head: [["Producto", "Cant.", "Precio"]],
    body: tableData,
  });

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let y = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: S/ ${subtotal.toFixed(2)}`, 10, y);

  if (discountData.code) {
    y += 8;
    doc.text(
      `Descuento (${discountData.code} -${discountData.discountPercent}%): -S/ ${discountData.discountAmount.toFixed(2)}`,
      10,
      y
    );
  }

  const totalFinal = discountData.totalAfterDiscount || subtotal;
  y += 8;
  doc.text(`Total Final: S/ ${totalFinal.toFixed(2)}`, 10, y);

  doc.save(`Pedido_${order.id}.pdf`);
};
