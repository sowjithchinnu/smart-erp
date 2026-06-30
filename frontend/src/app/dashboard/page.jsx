"use client";

import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../context/CompanyContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany, companies, selectCompany, } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  
  useEffect(() => {
  if (!companyId) {
    router.push("/company-selection");
    return;
  }

  // If page refreshed and selectedCompany is lost
  if (!selectedCompany && companies.length > 0) {
    const company = companies.find(
      (c) => c.id === Number(companyId)
    );

    if (company) {
      selectCompany(company);
    }
  }
}, [
  companyId,
  companies,
  selectedCompany,
  selectCompany,
  router,
]);
  
  if (!user) {
  return null;
}

if (!selectedCompany) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">
        Loading company...
      </p>
    </div>
  );
}

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        
        return (
      
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCompany.company_name} - Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Customers
                </h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Suppliers
                </h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Stock Items
                </h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
            </div>

            {/* Quick Actions */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-700 mb-4">
    Quick Actions
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <button
      onClick={() => setActiveTab("customers")}
      className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition"
    >
      <div className="text-2xl mb-2">👥</div>
      <p className="font-semibold">Add Customer</p>
    </button>

    <button
      onClick={() => setActiveTab("suppliers")}
      className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition"
    >
      <div className="text-2xl mb-2">🏢</div>
      <p className="font-semibold">Add Supplier</p>
    </button>

    <button
      onClick={() => setActiveTab("stock")}
      className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition"
    >
      <div className="text-2xl mb-2">📦</div>
      <p className="font-semibold">Add Stock Item</p>
    </button>

    <button
      onClick={() => setActiveTab("vouchers")}
      className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition"
    >
      <div className="text-2xl mb-2">🧾</div>
      <p className="font-semibold">Create Voucher</p>
    </button>
  </div>
</div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">GST Number</p>
                  <p className="text-gray-800">{selectedCompany.gst_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800">{selectedCompany.contact_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="text-gray-800">{selectedCompany.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Financial Year</p>
                  <p className="text-gray-800">
                    {selectedCompany.financial_year}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{selectedCompany.address}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
  <h3 className="text-xl font-semibold text-gray-700 mb-2">
    No Customers Found
  </h3>

  <p className="text-gray-500 mb-4">
    Start by adding your first customer.
  </p>

  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
    + Add Customer
  </button>
</div>
          </div>
        );

      case "suppliers":
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>

      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Suppliers Found
        </h3>

        <p className="text-gray-500 mb-4">
          Start by adding your first supplier.
        </p>

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          + Add Supplier
        </button>
      </div>
    </div>
  );

      case "stock":
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Stock Items
      </h2>

      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Stock Items Found
        </h3>

        <p className="text-gray-500 mb-4">
          Start by adding your first stock item.
        </p>

        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          + Add Stock Item
        </button>
      </div>
    </div>
  );

      case "vouchers":
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Vouchers
      </h2>

      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Vouchers Found
        </h3>

        <p className="text-gray-500 mb-4">
          Create your first sales or purchase voucher.
        </p>

        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
          + Create Voucher
        </button>
      </div>
    </div>
  );

      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Reports coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-blue-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}