import PDFDocument from "pdfkit";

/**
 * Stream invoice to an Express response
 * @param {object} order normalized order with:
 *  - _id
 *  - orderDateText
 *  - user { name, email }
 *  - shippingAddressText
 *  - items: [{ name, sku, price, quantity }]
 *  - totalAmount (number)
 * @param {Response} res Express response (already has headers set)
 */
export const streamInvoicePDF = async (order, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });

      // pipe to response
      doc.pipe(res);

      // Header
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown(1);

      // Order meta
      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Order Date: ${order.orderDateText}`);
      doc.text(`Customer: ${order.user?.name ?? "Customer"}`);
      if (order.user?.email) doc.text(`Email: ${order.user.email}`);
      doc.moveDown(0.5);
      doc.text(`Ship To: ${order.shippingAddressText}`);
      doc.moveDown(1);

      // Table header
      doc.fontSize(14).text("Products", { underline: true });
      doc.moveDown(0.5);

      // Table rows
      doc.fontSize(12);
      (order.items || []).forEach((item, idx) => {
        doc.text(
          `${idx + 1}. ${item.name}${item.sku ? ` (${item.sku})` : ""} — Qty: ${
            item.quantity
          } × ₹${item.price}`
        );
      });

      doc.moveDown(1);
      doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, {
        align: "right",
      });

      doc.end();

      doc.on("end", resolve);
      doc.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};