"use client";

import { useRouter } from "next/navigation";

export default function SalesTable({ salesVouchers }) {
  const router = useRouter();
  if (salesVouchers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No Sales Vouchers Found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Voucher No</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {salesVouchers.map((voucher) => (
            <tr key={voucher.id} className="border-t">
              <td className="p-3">{voucher.voucher_number}</td>
              <td className="p-3">{voucher.customer_name}</td>
              <td className="p-3">
                {new Date(voucher.voucher_date).toLocaleDateString()}
              </td>
              <td className="p-3 text-right">
                ₹ {voucher.total_amount}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => router.push(`/invoice?id=${voucher.id}`)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                >
                  View Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}