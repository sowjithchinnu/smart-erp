import api from "./api";

export const salesService = {
  async getSalesVouchers(companyId) {
    const response = await api.get(`/api/sales/company/${companyId}`);
    return response.data.salesVouchers;
  },

  async createSalesVoucher(data) {
    const response = await api.post("/api/sales", data);
    return response.data;
  },
};