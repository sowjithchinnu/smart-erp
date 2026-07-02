"use client";

const inputClassName =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function StockForm({
  entityType = "group",
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Save",
  title = "Details",
  formErrors = {},
  availableStockGroups = [],
  availableUnits = [],
}) {
  const renderFields = () => {
    if (entityType === "group") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              name="group_name"
              value={formData.group_name || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="e.g. Raw Materials"
              required
            />
            {formErrors.group_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.group_name}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              rows="3"
              className={inputClassName}
              placeholder="Optional details about the stock group"
            />
          </div>
        </>
      );
    }

    if (entityType === "unit") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Name
            </label>
            <input
              type="text"
              name="unit_name"
              value={formData.unit_name || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="e.g. Kilogram"
              required
            />
            {formErrors.unit_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.unit_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol || ""}
              onChange={onChange}
              className={inputClassName}
              placeholder="e.g. Kg"
              required
            />
            {formErrors.symbol && (
              <p className="mt-1 text-sm text-red-600">{formErrors.symbol}</p>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name || ""}
            onChange={onChange}
            className={inputClassName}
            placeholder="e.g. Premium Steel"
            required
          />
          {formErrors.item_name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.item_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku || ""}
            onChange={onChange}
            className={inputClassName}
            placeholder="e.g. ST-001"
            required
          />
          {formErrors.sku && (
            <p className="mt-1 text-sm text-red-600">{formErrors.sku}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Group
          </label>
          <select
            name="stock_group_id"
            value={formData.stock_group_id || ""}
            onChange={onChange}
            className={inputClassName}
            required
          >
            <option value="">Select a stock group</option>
            {availableStockGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </select>
          {formErrors.stock_group_id && (
            <p className="mt-1 text-sm text-red-600">{formErrors.stock_group_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            name="unit_id"
            value={formData.unit_id || ""}
            onChange={onChange}
            className={inputClassName}
            required
          >
            <option value="">Select a unit</option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.unit_name} ({unit.symbol})
              </option>
            ))}
          </select>
          {formErrors.unit_id && (
            <p className="mt-1 text-sm text-red-600">{formErrors.unit_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price
          </label>
          <input
            type="number"
            name="purchase_price"
            value={formData.purchase_price ?? ""}
            onChange={onChange}
            className={inputClassName}
            step="0.01"
          />
          {formErrors.purchase_price && (
            <p className="mt-1 text-sm text-red-600">{formErrors.purchase_price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price
          </label>
          <input
            type="number"
            name="selling_price"
            value={formData.selling_price ?? ""}
            onChange={onChange}
            className={inputClassName}
            step="0.01"
          />
          {formErrors.selling_price && (
            <p className="mt-1 text-sm text-red-600">{formErrors.selling_price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opening Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity ?? ""}
            onChange={onChange}
            className={inputClassName}
            step="0.01"
          />
          {formErrors.quantity && (
            <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST Percentage
          </label>
          <input
            type="number"
            name="gst_percentage"
            value={formData.gst_percentage ?? ""}
            onChange={onChange}
            className={inputClassName}
            step="0.01"
          />
          {formErrors.gst_percentage && (
            <p className="mt-1 text-sm text-red-600">{formErrors.gst_percentage}</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add or update a stock {entityType === "group" ? "group" : entityType === "unit" ? "unit" : "item"}.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFields()}
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
