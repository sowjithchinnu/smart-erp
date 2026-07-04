"use client";

import { useEffect, useState } from "react";
import { purchaseService } from "../../services/purchaseService";
import PurchaseTable from "./PurchaseTable";
import PurchaseForm from "./PurchaseForm";

export default function PurchaseModule({ companyId }) {
  const [purchaseVouchers, setPurchaseVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleNewItem = () => {
      setShowForm(true);
    };

    window.addEventListener("newItem", handleNewItem);

    return () => {
      window.removeEventListener("newItem", handleNewItem);
    };
  }, []);

  const loadPurchaseVouchers = async () => {
    try {
      const data = await purchaseService.getPurchaseVouchers(companyId);
      setPurchaseVouchers(data);
    } catch (error) {
      console.error("Error loading purchase vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePurchase = async (data) => {
    try {
      await purchaseService.createPurchaseVoucher(data);
      setShowForm(false);
      loadPurchaseVouchers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadPurchaseVouchers();
    }
  }, [companyId]);

  if (loading) {
    return <p className="text-gray-600">Loading Purchase Vouchers...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Vouchers</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Purchase
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <PurchaseForm onSubmit={handleCreatePurchase} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <PurchaseTable purchaseVouchers={purchaseVouchers} />
      </div>
    </div>
  );
}