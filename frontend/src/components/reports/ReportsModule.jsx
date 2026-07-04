"use client";

import { useEffect, useState } from "react";
import { reportService } from "../../services/reportService";

function ReportCard({ title, description, loading, empty, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : empty ? (
        <p className="text-sm text-gray-500">No data available.</p>
      ) : (
        children
      )}
    </div>
  );
}

export default function ReportsModule({ companyId }) {
  const [reports, setReports] = useState({
    stockSummary: [],
    lowStock: [],
    dailySales: [],
    purchaseRegister: [],
  });
  const [loading, setLoading] = useState({
    stockSummary: true,
    lowStock: true,
    dailySales: true,
    purchaseRegister: true,
  });
  const [errors, setErrors] = useState({
    stockSummary: false,
    lowStock: false,
    dailySales: false,
    purchaseRegister: false,
  });

  useEffect(() => {
    if (!companyId) {
      return;
    }

    const loadReports = async () => {
      setLoading({
        stockSummary: true,
        lowStock: true,
        dailySales: true,
        purchaseRegister: true,
      });
      setErrors({
        stockSummary: false,
        lowStock: false,
        dailySales: false,
        purchaseRegister: false,
      });

      const [stockSummaryResult, lowStockResult, dailySalesResult, purchaseRegisterResult] =
        await Promise.allSettled([
          reportService.getStockSummary(companyId),
          reportService.getLowStockReport(companyId),
          reportService.getDailySales(companyId),
          reportService.getPurchaseRegister(companyId),
        ]);

      setReports({
        stockSummary:
          stockSummaryResult.status === "fulfilled"
            ? stockSummaryResult.value?.stockSummary || []
            : [],
        lowStock:
          lowStockResult.status === "fulfilled"
            ? lowStockResult.value?.lowStock || []
            : [],
        dailySales:
          dailySalesResult.status === "fulfilled"
            ? dailySalesResult.value?.dailySales || []
            : [],
        purchaseRegister:
          purchaseRegisterResult.status === "fulfilled"
            ? purchaseRegisterResult.value?.purchaseRegister || []
            : [],
      });

      setErrors({
        stockSummary: stockSummaryResult.status === "rejected",
        lowStock: lowStockResult.status === "rejected",
        dailySales: dailySalesResult.status === "rejected",
        purchaseRegister: purchaseRegisterResult.status === "rejected",
      });

      setLoading({
        stockSummary: false,
        lowStock: false,
        dailySales: false,
        purchaseRegister: false,
      });
    };

    loadReports();
  }, [companyId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reports</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Inventory Reports</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ReportCard
              title="Stock Summary"
              description="Current stock availability for the selected company"
              loading={loading.stockSummary}
              empty={reports.stockSummary.length === 0} 
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="py-2 pr-3">Item</th>
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2 pr-3">Qty</th>
                      <th className="py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.stockSummary.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 pr-3 text-gray-800">{item.item_name}</td>
                        <td className="py-2 pr-3 text-gray-800">{item.sku}</td>
                        <td className="py-2 pr-3 text-gray-800">{item.quantity}</td>
                        <td className="py-2 text-gray-800">₹ {Number(item.selling_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>

            <ReportCard
              title="Low Stock Report"
              description="Items with quantity below 10"
              loading={loading.lowStock}
              empty={reports.lowStock.length === 0}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="py-2 pr-3">Item</th>
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.lowStock.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 pr-3 text-gray-800">{item.item_name}</td>
                        <td className="py-2 pr-3 text-gray-800">{item.sku}</td>
                        <td className="py-2 text-gray-800">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Reports</h3>
          <ReportCard
            title="Daily Sales Report"
            description="Sales summary grouped by voucher date"
            loading={loading.dailySales}
            empty={reports.dailySales.length === 0}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Sales Count</th>
                    <th className="py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.dailySales.map((item, index) => (
                    <tr key={`${item.voucher_date}-${index}`} className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-800">
                        {new Date(item.voucher_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-3 text-gray-800">{item.total_sales}</td>
                      <td className="py-2 text-gray-800">₹ {Number(item.revenue).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase Reports</h3>
          <ReportCard
            title="Purchase Register"
            description="Purchase voucher activity for the selected company"
            loading={loading.purchaseRegister}
            empty={reports.purchaseRegister.length === 0}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 pr-3">Voucher No</th>
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.purchaseRegister.map((item, index) => (
                    <tr key={`${item.voucher_number}-${index}`} className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-800">{item.voucher_number}</td>
                      <td className="py-2 pr-3 text-gray-800">
                        {new Date(item.voucher_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-gray-800">₹ {Number(item.total_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>
        </div>
      </div>
    </div>
  );
}
