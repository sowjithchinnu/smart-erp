"use client";

import { useState } from "react";

export default function SalesForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    company_id: "",
    customer_id: "",
    voucher_date: "",
    notes: "",
    items: [
      {
        stock_item_id: "",
        quantity: "",
        rate: "",
      },
    ],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <input
        name="company_id"
        placeholder="Company ID"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        name="customer_id"
        placeholder="Customer ID"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="date"
        name="voucher_date"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <h3 className="font-semibold">Item</h3>

      <input
        placeholder="Stock Item ID"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          handleItemChange(0, "stock_item_id", e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Quantity"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          handleItemChange(0, "quantity", e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Rate"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          handleItemChange(0, "rate", e.target.value)
        }
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Sale
      </button>
    </form>
  );
}