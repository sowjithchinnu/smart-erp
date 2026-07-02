"use client";

export default function StockTable({
  rows = [],
  entityType = "group",
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = "No records found.",
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 border border-gray-200 text-center text-gray-500">
        Loading records...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 border border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {entityType === "group"
            ? "No Stock Groups Found"
            : entityType === "unit"
            ? "No Units Found"
            : "No Stock Items Found"}
        </h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const renderRows = () => {
    if (entityType === "group") {
      return rows.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{row.group_name}</td>
          <td className="px-4 py-3 text-sm text-gray-700">{row.description || "-"}</td>
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            <button onClick={() => onEdit && onEdit(row)} className="text-blue-600 hover:text-blue-800 mr-4">
              Edit
            </button>
            <button onClick={() => onDelete && onDelete(row)} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    if (entityType === "unit") {
      return rows.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{row.unit_name}</td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.symbol}</td>
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            <button onClick={() => onEdit && onEdit(row)} className="text-blue-600 hover:text-blue-800 mr-4">
              Edit
            </button>
            <button onClick={() => onDelete && onDelete(row)} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    return rows.map((row) => (
      <tr key={row.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{row.item_name}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.sku || "-"}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.stock_group_name || "-"}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.unit_name || "-"}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {Number(row.purchase_price || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
          {Number(row.selling_price || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.quantity || 0}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row.gst_percentage || 0}%</td>
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
          <button onClick={() => onEdit && onEdit(row)} className="text-blue-600 hover:text-blue-800 mr-4">
            Edit
          </button>
          <button onClick={() => onDelete && onDelete(row)} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const renderHeaders = () => {
    if (entityType === "group") {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Group Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Description
          </th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </>
      );
    }

    if (entityType === "unit") {
      return (
        <>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Unit Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Symbol
          </th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </>
      );
    }

    return (
      <>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Item Name
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          SKU
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Group
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Unit
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Purchase Price
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Selling Price
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Qty
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          GST %
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
