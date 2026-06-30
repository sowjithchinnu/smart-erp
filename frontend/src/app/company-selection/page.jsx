"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../context/CompanyContext";
import CompanyCard from "../../components/company/CompanyCard";
import { useState, useEffect } from "react";



export default function CompanySelectionPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    address: "",
    gst_number: "",
    state: "",
    financial_year: "",
    contact_phone: "",
  });
  const { user, logout } = useAuth();
  const { companies, loading, createCompany, fetchCompanies, selectCompany } = useCompany();
  console.log("companies:", companies);
  console.log("isArray:", Array.isArray(companies));
  const router = useRouter();


  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await createCompany(newCompany);
      setShowCreateForm(false);
      setNewCompany({
        company_name: "",
        address: "",
        gst_number: "",
        state: "",
        financial_year: "",
        contact_phone: "",
      });
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleSelectCompany = (company) => {
    selectCompany(company);
    router.push(`/dashboard?companyId=${company.id}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
  fetchCompanies();
}, []);

  console.log(companies);
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">SmartERP</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Select Your Company
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showCreateForm ? "Cancel" : "Create Company"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Company</h3>
            <form onSubmit={handleCreateCompany}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newCompany.company_name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, company_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={newCompany.gst_number}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        gst_number: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={newCompany.contact_phone}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        contact_phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newCompany.state}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Financial Year
                  </label>
                  <input
                    type="text"
                    value={newCompany.financial_year}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        financial_year: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2024-2025"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                  </label>
                  <textarea
                    value={newCompany.address}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Create Company
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No companies found. Create your first company to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onSelect={handleSelectCompany}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}