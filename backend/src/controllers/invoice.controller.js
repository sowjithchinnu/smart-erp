const db = require("../config/db");
const PDFDocument = require("pdfkit");
const getSalesInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceResult = await db.query(
      `
      SELECT
        sv.id,
        sv.voucher_number,
        sv.voucher_date,
        sv.total_amount,
        l.ledger_name AS customer_name
      FROM sales_vouchers sv
      JOIN ledgers l ON sv.customer_id = l.id
      WHERE sv.id = $1
      `,
      [id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const itemsResult = await db.query(
      `
      SELECT
        svi.quantity,
        svi.rate,
        svi.amount,
        si.item_name
      FROM sales_voucher_items svi
      JOIN stock_items si
      ON svi.stock_item_id = si.id
      WHERE svi.sales_voucher_id = $1
      `,
      [id]
    );

    return res.json({
      success: true,
      invoice: {
        ...invoiceResult.rows[0],
        items: itemsResult.rows,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const downloadSalesInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceResult = await db.query(
      `
      SELECT
        sv.voucher_number,
        sv.voucher_date,
        sv.total_amount,
        l.ledger_name AS customer_name
      FROM sales_vouchers sv
      JOIN ledgers l ON sv.customer_id = l.id
      WHERE sv.id = $1
      `,
      [id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const itemsResult = await db.query(
      `
      SELECT
        si.item_name,
        svi.quantity,
        svi.rate,
        svi.amount
      FROM sales_voucher_items svi
      JOIN stock_items si
      ON svi.stock_item_id = si.id
      WHERE svi.sales_voucher_id = $1
      `,
      [id]
    );

    const invoice = invoiceResult.rows[0];

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.voucher_number}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(22).text("GST INVOICE", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice No: ${invoice.voucher_number}`);
    doc.text(
      `Date: ${new Date(invoice.voucher_date).toLocaleDateString()}`
    );
    doc.text(`Customer: ${invoice.customer_name}`);

    doc.moveDown();

    doc.text("Items");
    doc.moveDown(0.5);

    itemsResult.rows.forEach((item) => {
      doc.text(
        `${item.item_name}    Qty:${item.quantity}    Rate:${item.rate}    Amount:${item.amount}`
      );
    });

    doc.moveDown();

    doc.fontSize(16).text(
      `Grand Total : ₹ ${invoice.total_amount}`,
      {
        align: "right",
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  getSalesInvoice,
  downloadSalesInvoice
};