
import PDFDocument from "pdfkit";

/**
 * Stream shipping label to response
 * @param {object} order normalized order with:
 *  - _id
 *  - recipientName
 *  - recipientPhone
 *  - shippingAddressText
 * @param {Response} res
 */
export const streamShippingLabelPDF = async (order, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 24, size: "A6" }); // A6 label size works well
      doc.pipe(res);

      doc.fontSize(18).text("📦 Shipping Label", { align: "center" });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Recipient: ${order.recipientName}`);
      doc.text(`Phone: ${order.recipientPhone}`);
      doc.moveDown(0.5);
      doc.text("Address:");
      doc.text(order.shippingAddressText, { width: 260 });
      doc.moveDown(1);

      doc.fontSize(12).text("Handle With Care", {
        align: "center",
        underline: true,
      });

      doc.end();
      doc.on("end", resolve);
      doc.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};