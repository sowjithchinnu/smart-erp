"use client";

const inputClassName =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function LedgerForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Save Ledger",
  title = "Ledger Details",
  ledgerTypeLabel = "",
  formErrors = {},
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add or update a ledger for the selected company.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Name
            </label>
            <input
              type="text"
              name="ledger_name"
              value={formData.ledger_name || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="e.g. ABC Traders"
              required
            />
            {formErrors.ledger_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.ledger_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Type
            </label>
            <input
              type="text"
              name="ledger_type"
              value={ledgerTypeLabel || formData.ledger_type || ""}
              readOnly
              className={`${inputClassName} bg-gray-50 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address || ""}
              onChange={onChange}
              rows="3"
              className={inputClassName}
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Balance
            </label>
            <input
              type="number"
              name="opening_balance"
              value={formData.opening_balance ?? 0}
              onChange={onChange}
              className={inputClassName}
              step="0.01"
            />
            {formErrors.opening_balance && (
              <p className="mt-1 text-sm text-red-600">{formErrors.opening_balance}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : submitLabel}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
