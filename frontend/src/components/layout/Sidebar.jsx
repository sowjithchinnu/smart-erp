"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuGroups = [
    {
      title: null,
      items: [{ id: "overview", label: "Overview", icon: "📊" }],
    },
    {
      title: "Ledgers",
      items: [
        { id: "customers", label: "Customers", icon: "👥" },
        { id: "suppliers", label: "Suppliers", icon: "🏢" },
        { id: "stock", label: "Stock Items", icon: "📦" },
        { id: "cash", label: "Cash Ledgers", icon: "💵" },
        { id: "bank", label: "Bank Ledgers", icon: "🏦" },
        { id: "income", label: "Income Ledgers", icon: "💰" },
        { id: "expense", label: "Expense Ledgers", icon: "📉" },
      ],
    },
    {
      title: null,
      items: [
        { id: "vouchers", label: "Vouchers", icon: "📝" },
        { id: "reports", label: "Reports", icon: "📈" },
      ],
    },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">SmartERP</h1>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-4">
          {menuGroups.map((group, index) => (
            <div
              key={index}
              className={index !== 0 ? "bg-gray-700 rounded-lg p-3" : ""}
            >
              {group.title && (
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  {group.title}
                </p>
              )}
              <ul className={index !== 0 ? "space-y-1" : "space-y-2"}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-600 text-white"
                          : index !== 0
                          ? "text-gray-200 hover:bg-gray-600 hover:text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="text-sm font-semibold">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}