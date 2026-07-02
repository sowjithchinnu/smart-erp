"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { stockService } from "../../services/stockService";
import StockForm from "./StockForm";
import StockTable from "./StockTable";

const getBlankFormData = (entityType) => {
  if (entityType === "unit") {
    return {
      unit_name: "",
      symbol: "",
    };
  }

  if (entityType === "item") {
    return {
      item_name: "",
      sku: "",
      stock_group_id: "",
      unit_id: "",
      purchase_price: "",
      selling_price: "",
      quantity: "",
      gst_percentage: "",
    };
  }

  return {
    group_name: "",
    description: "",
  };
};

export default function StockModule({ activeModule, selectedCompany }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(getBlankFormData(activeModule?.entityType || "group"));
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [availableStockGroups, setAvailableStockGroups] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);

  const entityType = activeModule?.entityType || "group";
  const activeLabel = activeModule?.label || "Stock";
  const singularLabel = activeModule?.singularLabel || activeLabel;
  const notificationClassName = notification?.type === "success"
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-red-50 border-red-200 text-red-800";

  const resetForm = useCallback(() => {
    setFormData(getBlankFormData(entityType));
    setEditingRecord(null);
    setFormErrors({});
  }, [entityType]);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const fetchRecords = useCallback(async () => {
    if (!selectedCompany || !entityType) return;

    setLoading(true);
    try {
      let result = [];

      if (entityType === "group") {
        result = await stockService.getCompanyStockGroups(selectedCompany.id);
      } else if (entityType === "unit") {
        result = await stockService.getCompanyUnits(selectedCompany.id);
      } else {
        const [items, groups, units] = await Promise.all([
          stockService.getCompanyStockItems(selectedCompany.id),
          stockService.getCompanyStockGroups(selectedCompany.id),
          stockService.getCompanyUnits(selectedCompany.id),
        ]);
        result = items || [];
        setAvailableStockGroups(groups || []);
        setAvailableUnits(units || []);
      }

      setRows(result || []);
    } catch (error) {
      console.error(`Failed to load ${activeLabel.toLowerCase()}`, error);
      showNotification("error", `Could not load ${activeLabel.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [activeLabel, entityType, selectedCompany, showNotification]);

  useEffect(() => {
    resetForm();
    setSearchQuery("");
    fetchRecords();
  }, [activeModule, selectedCompany, fetchRecords, resetForm]);

  const openModal = useCallback((record = null) => {
    if (record) {
      setEditingRecord(record);
      if (entityType === "group") {
        setFormData({
          group_name: record.group_name || "",
          description: record.description || "",
        });
      } else if (entityType === "unit") {
        setFormData({
          unit_name: record.unit_name || "",
          symbol: record.symbol || "",
        });
      } else {
        setFormData({
          item_name: record.item_name || "",
          sku: record.sku || "",
          stock_group_id: record.stock_group_id || "",
          unit_id: record.unit_id || "",
          purchase_price: record.purchase_price ?? "",
          selling_price: record.selling_price ?? "",
          quantity: record.quantity ?? "",
          gst_percentage: record.gst_percentage ?? "",
        });
      }
      setFormErrors({});
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  }, [entityType, resetForm]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    const numericFields = ["purchase_price", "selling_price", "quantity", "gst_percentage"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};

    if (entityType === "group") {
      if (!formData.group_name?.trim()) {
        errors.group_name = "Group name is required.";
      }
    } else if (entityType === "unit") {
      if (!formData.unit_name?.trim()) {
        errors.unit_name = "Unit name is required.";
      }
      if (!formData.symbol?.trim()) {
        errors.symbol = "Symbol is required.";
      }
    } else {
      if (!formData.item_name?.trim()) {
        errors.item_name = "Item name is required.";
      }
      if (!formData.sku?.trim()) {
        errors.sku = "SKU is required.";
      }
      if (!formData.stock_group_id) {
        errors.stock_group_id = "Stock group is required.";
      }
      if (!formData.unit_id) {
        errors.unit_id = "Unit is required.";
      }

      ["purchase_price", "selling_price", "quantity", "gst_percentage"].forEach((field) => {
        if (formData[field] !== "" && Number.isNaN(Number(formData[field]))) {
          errors[field] = `${field.replace(/_/g, " ")} must be a number.`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [entityType, formData]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!selectedCompany) return;
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (entityType === "group") {
        if (editingRecord) {
          await stockService.updateStockGroup(editingRecord.id, formData);
          showNotification("success", `${singularLabel} updated successfully.`);
        } else {
          await stockService.createStockGroup(selectedCompany.id, formData);
          showNotification("success", `${singularLabel} created successfully.`);
        }
      } else if (entityType === "unit") {
        if (editingRecord) {
          await stockService.updateUnit(editingRecord.id, formData);
          showNotification("success", `${singularLabel} updated successfully.`);
        } else {
          await stockService.createUnit(selectedCompany.id, formData);
          showNotification("success", `${singularLabel} created successfully.`);
        }
      } else if (editingRecord) {
        await stockService.updateStockItem(editingRecord.id, formData);
        showNotification("success", `${singularLabel} updated successfully.`);
      } else {
        await stockService.createStockItem(selectedCompany.id, formData);
        showNotification("success", `${singularLabel} created successfully.`);
      }

      await fetchRecords();
      closeModal();
    } catch (error) {
      console.error(`Failed to save ${activeLabel.toLowerCase()}`, error);
      showNotification("error", `Failed to save ${activeLabel.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  }, [activeLabel, closeModal, editingRecord, entityType, fetchRecords, formData, selectedCompany, showNotification, singularLabel, validateForm]);

  const handleDelete = useCallback(async (record) => {
    if (!confirm(`Delete ${record.group_name || record.unit_name || record.item_name}?`)) {
      return;
    }

    setLoading(true);
    try {
      if (entityType === "group") {
        await stockService.deleteStockGroup(record.id);
      } else if (entityType === "unit") {
        await stockService.deleteUnit(record.id);
      } else {
        await stockService.deleteStockItem(record.id);
      }

      showNotification("success", `${record.group_name || record.unit_name || record.item_name} deleted successfully.`);
      await fetchRecords();
    } catch (error) {
      console.error(`Failed to delete ${activeLabel.toLowerCase()}`, error);
      showNotification("error", `Failed to delete ${activeLabel.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [activeLabel, entityType, fetchRecords, showNotification]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      const searchable =
        entityType === "group"
          ? [row.group_name, row.description]
          : entityType === "unit"
          ? [row.unit_name, row.symbol]
          : [row.item_name, row.sku, row.stock_group_name, row.unit_name];

      return searchable.filter(Boolean).join(" ").toLowerCase().includes(query);
    });
  }, [entityType, rows, searchQuery]);

  return (
    <div className="space-y-6">
      {notification && (
        <div role="alert" className={`rounded-lg border px-4 py-3 ${notificationClassName}`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{activeLabel}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage {activeLabel.toLowerCase()} for {selectedCompany.company_name}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + {activeModule.createLabel}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
          placeholder={`Search ${activeLabel}...`}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={fetchRecords}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      <StockTable
        rows={filteredRows}
        entityType={entityType}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
        emptyMessage={activeModule.emptyMessage}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingRecord ? `Edit ${singularLabel}` : `Add ${singularLabel}`}
                </h3>
                <p className="text-sm text-gray-500">
                  Save {activeLabel.toLowerCase()} for {selectedCompany.company_name}.
                </p>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="p-6">
              <StockForm
                entityType={entityType}
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={saving}
                submitLabel={editingRecord ? `Update ${singularLabel}` : `Create ${singularLabel}`}
                title={editingRecord ? `Edit ${singularLabel}` : `New ${singularLabel}`}
                formErrors={formErrors}
                availableStockGroups={availableStockGroups}
                availableUnits={availableUnits}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
