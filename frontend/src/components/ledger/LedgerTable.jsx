"use client";

export default function LedgerTable({
  ledgers = [],
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = "No ledgers found.",
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 border border-gray-200 text-center text-gray-500">
        Loading ledgers...
      </div>
    );
  }

  if (!ledgers.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Ledgers Found</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ledger Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Opening Balance
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {ledgers.map((ledger) => (
              <tr key={ledger.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{ledger.ledger_name}</div>
                  {ledger.email && (
                    <div className="text-sm text-gray-500">{ledger.email}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {ledger.ledger_type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {ledger.contact_person || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {ledger.phone || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {Number(ledger.opening_balance || 0).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit && onEdit(ledger)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(ledger)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
