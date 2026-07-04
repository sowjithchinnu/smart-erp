import api from "./api";

export const purchaseService = {
  async getPurchaseVouchers(companyId) {
    const response = await api.get(`/api/purchase/company/${companyId}`);
    return response.data.purchaseVouchers;
  },

  async createPurchaseVoucher(data) {
    const response = await api.post("/api/purchase", data);
    return response.data;
  },
};