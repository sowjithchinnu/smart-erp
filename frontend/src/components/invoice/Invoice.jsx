"use client";
import { invoiceService } from "../../services/invoiceService";
export default function Invoice({ invoice }) {
  if (!invoice) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        GST INVOICE
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p><b>Invoice No:</b> {invoice.voucher_number}</p>
          <p><b>Date:</b> {new Date(invoice.voucher_date).toLocaleDateString()}</p>
        </div>

        <div className="text-right">
          <p><b>Customer:</b> {invoice.customer_name}</p>
        </div>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Item</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.item_name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">₹ {item.rate}</td>
              <td className="border p-2">₹ {item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-6">
        <h2 className="text-2xl font-bold">
          Total : ₹ {invoice.total_amount}
        </h2>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Print Invoice
        </button>

        <button
  onClick={() => invoiceService.downloadSalesInvoice(invoice.id)}
  className="bg-green-600 text-white px-5 py-2 rounded"
>
  Download PDF
</button>

      </div>
    </div>
  );
}