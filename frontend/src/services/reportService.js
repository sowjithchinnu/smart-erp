import api from "./api";

export const reportService = {
  async getStockSummary(companyId) {
    const response = await api.get(`/api/reports/stock-summary/${companyId}`);
    return response.data;
  },

  async getLowStockReport(companyId) {
    const response = await api.get(`/api/reports/low-stock/${companyId}`);
    return response.data;
  },

  async getDailySales(companyId) {
    const response = await api.get(`/api/reports/daily-sales/${companyId}`);
    return response.data;
  },

  async getPurchaseRegister(companyId) {
    const response = await api.get(`/api/reports/purchase-register/${companyId}`);
    return response.data;
  },
};
