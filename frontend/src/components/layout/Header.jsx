"use client";

import { useCompany } from "../../context/CompanyContext";

export default function Header() {
  const { selectedCompany } = useCompany();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCompany?.company_name || "Dashboard"}
          </h2>
          <p className="text-sm text-gray-500">
            {selectedCompany?.gst_number || ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Financial Year</p>
            <p className="text-sm font-semibold text-gray-700">
              {selectedCompany?.financial_year || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}