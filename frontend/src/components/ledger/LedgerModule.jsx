"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ledgerService } from "../../services/ledgerService";
import LedgerForm from "./LedgerForm";
import LedgerTable from "./LedgerTable";

const getBlankFormData = (ledgerType) => ({
  ledger_name: "",
  ledger_type: ledgerType,
  contact_person: "",
  email: "",
  phone: "",
  gst_number: "",
  address: "",
  opening_balance: 0,
});

const ledgerTypeLabels = {
  CUSTOMER: "Customer",
  SUPPLIER: "Supplier",
  STOCK: "Stock",
  CASH: "Cash",
  BANK: "Bank",
  INCOME: "Income",
  EXPENSE: "Expense",
};

export default function LedgerModule({ activeModule, selectedCompany }) {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState(null);
  const [formData, setFormData] = useState(getBlankFormData(activeModule?.ledgerType || ""));
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const activeLedgerType = activeModule?.ledgerType || "";
  const activeLabel = activeModule?.label || "Ledger";
  const notificationClassName = notification?.type === "success"
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-red-50 border-red-200 text-red-800";

  const resetForm = useCallback(() => {
    setFormData(getBlankFormData(activeLedgerType));
    setEditingLedger(null);
    setFormErrors({});
  }, [activeLedgerType]);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (!notification) return undefined;

    const timer = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const fetchLedgers = useCallback(async () => {
    if (!selectedCompany || !activeLedgerType) return;

    setLoading(true);
    try {
      const result = await ledgerService.getCompanyLedgers(selectedCompany.id);
      const filtered = result.filter(
        (ledger) => ledger.ledger_type?.toLowerCase() === activeLedgerType.toLowerCase()
      );
      setLedgers(filtered);
    } catch (error) {
      console.error(`Failed to load ${activeLabel.toLowerCase()}`, error);
      showNotification("error", `Could not load ${activeLabel.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [activeLabel, activeLedgerType, selectedCompany, showNotification]);

  useEffect(() => {
    resetForm();
    setSearchQuery("");
    fetchLedgers();
  }, [activeModule, selectedCompany, fetchLedgers, resetForm]);

  const openModal = useCallback(
    (ledger = null) => {
      if (ledger) {
        setEditingLedger(ledger);
        setFormData({
          ledger_name: ledger.ledger_name || "",
          ledger_type: activeLedgerType || ledger.ledger_type,
          contact_person: ledger.contact_person || "",
          email: ledger.email || "",
          phone: ledger.phone || "",
          gst_number: ledger.gst_number || "",
          address: ledger.address || "",
          opening_balance: ledger.opening_balance || 0,
        });
        setFormErrors({});
      } else {
        resetForm();
      }
      setIsModalOpen(true);
    },
    [activeLedgerType, resetForm]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "opening_balance" ? Number(value) : value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.ledger_name?.trim()) {
      errors.ledger_name = "Ledger name is required.";
    }

    if (formData.opening_balance !== "" && Number.isNaN(Number(formData.opening_balance))) {
      errors.opening_balance = "Opening balance must be a number.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!selectedCompany) return;
      if (!validateForm()) {
        return;
      }

      setSaving(true);
      try {
        const payload = {
          ...formData,
          ledger_type: activeLedgerType,
        };

        if (editingLedger) {
          await ledgerService.updateLedger(editingLedger.id, payload);
          showNotification("success", `${activeLabel} updated successfully.`);
        } else {
          await ledgerService.createLedger({
            ...payload,
            company_id: selectedCompany.id,
          });
          showNotification("success", `${activeLabel} created successfully.`);
        }

        await fetchLedgers();
        closeModal();
      } catch (error) {
        console.error(`Failed to save ${activeLabel.toLowerCase()}`, error);
        showNotification("error", `Failed to save ${activeLabel.toLowerCase()}.`);
      } finally {
        setSaving(false);
      }
    },
    [activeLabel, activeLedgerType, closeModal, editingLedger, fetchLedgers, formData, selectedCompany, showNotification, validateForm]
  );

  const handleDelete = useCallback(
    async (ledger) => {
      if (!confirm(`Delete ${ledger.ledger_name}?`)) {
        return;
      }

      setLoading(true);
      try {
        await ledgerService.deleteLedger(ledger.id);
        showNotification("success", `${ledger.ledger_name} deleted successfully.`);
        await fetchLedgers();
      } catch (error) {
        console.error(`Failed to delete ${activeLabel.toLowerCase()}`, error);
        showNotification("error", `Failed to delete ${activeLabel.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    },
    [activeLabel, fetchLedgers, showNotification]
  );

  const filteredLedgers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ledgers;

    return ledgers.filter((ledger) => {
      const searchable = [
        ledger.ledger_name,
        ledger.contact_person,
        ledger.email,
        ledger.phone,
        ledger.gst_number,
        ledger.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [ledgers, searchQuery]);

  return (
    <div className="space-y-6">
      {notification && (
        <div
          role="alert"
          className={`rounded-lg border px-4 py-3 ${notificationClassName}`}
        >
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
          onClick={fetchLedgers}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      <LedgerTable
        ledgers={filteredLedgers}
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
                  {editingLedger ? `Edit ${activeLabel.slice(0, -1)}` : `Add ${activeLabel.slice(0, -1)}`}
                </h3>
                <p className="text-sm text-gray-500">
                  Save {activeLabel.toLowerCase()} for {selectedCompany.company_name}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <LedgerForm
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={saving}
                submitLabel={editingLedger ? `Update ${activeLabel.slice(0, -1)}` : `Create ${activeLabel.slice(0, -1)}`}
                title={editingLedger ? `Edit ${activeLabel.slice(0, -1)}` : `New ${activeLabel.slice(0, -1)}`}
                ledgerTypeLabel={ledgerTypeLabels[activeLedgerType] || activeLedgerType}
                formErrors={formErrors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
