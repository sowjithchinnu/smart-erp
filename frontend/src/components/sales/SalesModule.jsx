"use client";

import { useEffect, useState } from "react";
import { salesService } from "../../services/salesService";
import SalesTable from "./SalesTable";
import SalesForm from "./SalesForm";

export default function SalesModule({ companyId }) {
  const [salesVouchers, setSalesVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadSalesVouchers = async () => {
    try {
      const data = await salesService.getSalesVouchers(companyId);
      setSalesVouchers(data);
    } catch (error) {
      console.error("Error loading sales vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSales = async (data) => {
    try {
      await salesService.createSalesVoucher(data);
      setShowForm(false);
      loadSalesVouchers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadSalesVouchers();
    }
  }, [companyId]);

  if (loading) {
    return <p className="text-gray-600">Loading Sales Vouchers...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Vouchers</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Sale
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <SalesForm onSubmit={handleCreateSales} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <SalesTable salesVouchers={salesVouchers} />
      </div>
    </div>
  );
}