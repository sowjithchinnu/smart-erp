"use client";

import { useAuth } from "../../context/AuthContext";
import { useCompany } from "../../context/CompanyContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import LedgerModule from "../../components/ledger/LedgerModule";
import StockModule from "../../components/stock/StockModule";
import PurchaseModule from "../../components/purchase/PurchaseModule";
import SalesModule from "../../components/sales/SalesModule";
import ReportsModule from "../../components/reports/ReportsModule";
import { companyService } from "../../services/companyService";
import { purchaseService } from "../../services/purchaseService";
import { salesService } from "../../services/salesService";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const moduleConfig = {
  overview: {
    label: "Overview",
  },
  customers: {
    label: "Customers",
    ledgerType: "CUSTOMER",
    createLabel: "Customer",
    emptyMessage: "Add customers to start managing your customer ledger.",
  },
  suppliers: {
    label: "Suppliers",
    ledgerType: "SUPPLIER",
    createLabel: "Supplier",
    emptyMessage: "Add suppliers to start managing your supplier ledger.",
  },
  "stock-groups": {
    label: "Stock Groups",
    entityType: "group",
    createLabel: "Stock Group",
    emptyMessage: "Add stock groups to organize your inventory.",
    singularLabel: "Stock Group",
  },
  units: {
    label: "Units of Measure",
    entityType: "unit",
    createLabel: "Unit",
    emptyMessage: "Add units of measure to track quantities accurately.",
    singularLabel: "Unit",
  },
  stock: {
    label: "Stock Items",
    entityType: "item",
    createLabel: "Stock Item",
    emptyMessage: "Add stock items to start tracking inventory.",
    singularLabel: "Stock Item",
  },
  cash: {
    label: "Cash Ledgers",
    ledgerType: "CASH",
    createLabel: "Cash Ledger",
    emptyMessage: "Create cash ledger entries to track cash accounts.",
  },
  bank: {
    label: "Bank Ledgers",
    ledgerType: "BANK",
    createLabel: "Bank Ledger",
    emptyMessage: "Create bank ledger entries to track bank accounts.",
  },
  income: {
    label: "Income Ledgers",
    ledgerType: "INCOME",
    createLabel: "Income Ledger",
    emptyMessage: "Create income ledger entries for revenue tracking.",
  },
  expense: {
    label: "Expense Ledgers",
    ledgerType: "EXPENSE",
    createLabel: "Expense Ledger",
    emptyMessage: "Create expense ledger entries for cost tracking.",
  },
  vouchers: {
    label: "Vouchers",
  },
  reports: {
    label: "Reports",
  },
};

export const dynamic = "force-dynamic";

function DashboardContent({ activeTab, setActiveTab, selectedCompany, companies, selectCompany }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");
  const activeModule = moduleConfig[activeTab];
  const [overviewStats, setOverviewStats] = useState({
    customers: 0,
    suppliers: 0,
    stockItems: 0,
  });
  const [companyProfile, setCompanyProfile] = useState(selectedCompany);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    if (!companyId) {
      router.push("/company-selection");
      return;
    }

    if (!selectedCompany && companies.length > 0) {
      const company = companies.find((c) => c.id === Number(companyId));
      if (company) {
        selectCompany(company);
      }
    }
  }, [companyId, companies, selectedCompany, selectCompany, router]);

  useEffect(() => {
    if (!selectedCompany?.id) {
      return;
    }

    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [dashboardData, purchaseVouchers, salesVouchers] = await Promise.all([
          companyService.getDashboardStats(selectedCompany.id),
          purchaseService.getPurchaseVouchers(selectedCompany.id),
          salesService.getSalesVouchers(selectedCompany.id),
        ]);

        if (!isMounted) {
          return;
        }

        setCompanyProfile(dashboardData.company || selectedCompany);
        setOverviewStats({
          customers: dashboardData.counts?.customers ?? 0,
          suppliers: dashboardData.counts?.suppliers ?? 0,
          stockItems: dashboardData.counts?.stockItems ?? 0,
        });

        const mergedVouchers = [
          ...purchaseVouchers.map((voucher) => ({
            ...voucher,
            voucherType: "Purchase",
            partyName: voucher.supplier_name,
            date: voucher.voucher_date,
            totalAmount: voucher.total_amount,
          })),
          ...salesVouchers.map((voucher) => ({
            ...voucher,
            voucherType: "Sales",
            partyName: voucher.customer_name,
            date: voucher.voucher_date,
            totalAmount: voucher.total_amount,
          })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setVouchers(mergedVouchers);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [selectedCompany?.id]);

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading company...</p>
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
                <p className="text-3xl font-bold text-blue-600">{overviewStats.customers}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Suppliers
                </h3>
                <p className="text-3xl font-bold text-green-600">{overviewStats.suppliers}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Stock Items
                </h3>
                <p className="text-3xl font-bold text-purple-600">{overviewStats.stockItems}</p>
              </div>
            </div>

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
                  onClick={() => setActiveTab("purchase")}
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
                  <p className="text-gray-800">{companyProfile?.gst_number ?? selectedCompany.gst_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800">{companyProfile?.contact_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="text-gray-800">{companyProfile?.state ?? selectedCompany.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Financial Year</p>
                  <p className="text-gray-800">{companyProfile?.financial_year ?? selectedCompany.financial_year}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{companyProfile?.address ?? selectedCompany.address}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "customers":
      case "suppliers":
      case "cash":
      case "bank":
      case "income":
      case "expense":
        return (
          <LedgerModule activeModule={activeModule} selectedCompany={selectedCompany} />
        );

      case "stock":
      case "stock-groups":
      case "units":
        return (
          <StockModule activeModule={activeModule} selectedCompany={selectedCompany} />
        );
      case "purchase":
    return <PurchaseModule companyId={selectedCompany.id} />;
        case "sales":
  return <SalesModule companyId={selectedCompany.id} />;
      case "vouchers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Vouchers</h2>

            <div className="bg-white rounded-lg shadow-md p-6">
              {vouchers.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Vouchers Found
                  </h3>

                  <p className="text-gray-500 mb-4">
                    Create your first sales or purchase voucher.
                  </p>

                  <button
                    onClick={() => setActiveTab("purchase")}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                  >
                    + Create Voucher
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-600">
                        <th className="py-3 pr-4">Voucher Number</th>
                        <th className="py-3 pr-4">Voucher Type</th>
                        <th className="py-3 pr-4">Party Name</th>
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers.map((voucher) => (
                        <tr key={`${voucher.voucherType}-${voucher.id}`} className="border-b border-gray-100">
                          <td className="py-3 pr-4 text-gray-800">{voucher.voucher_number}</td>
                          <td className="py-3 pr-4 text-gray-800">{voucher.voucherType}</td>
                          <td className="py-3 pr-4 text-gray-800">{voucher.partyName}</td>
                          <td className="py-3 pr-4 text-gray-800">
                            {new Date(voucher.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-gray-800">
                            {Number(voucher.totalAmount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case "reports":
        return <ReportsModule companyId={selectedCompany.id} />;

      default:
        return null;
    }
  };

  return renderContent();
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { selectedCompany, companies, selectCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-blue-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-gray-600">
                Loading...
              </div>
            }
          >
            <DashboardContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCompany={selectedCompany}
              companies={companies}
              selectCompany={selectCompany}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
