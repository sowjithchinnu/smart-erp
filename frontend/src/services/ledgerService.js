import api from "./api";

export const ledgerService = {
  async getCompanyLedgers(companyId) {
    const response = await api.get(`/api/ledger/company/${companyId}`);
    return response.data.ledgers;
  },

  async getLedgerById(id) {
    const response = await api.get(`/api/ledger/${id}`);
    return response.data;
  },

  async createLedger(ledgerData) {
    const response = await api.post("/api/ledger", ledgerData);
    return response.data;
  },

  async updateLedger(id, ledgerData) {
    const response = await api.put(`/api/ledger/${id}`, ledgerData);
    return response.data;
  },

  async deleteLedger(id) {
    const response = await api.delete(`/api/ledger/${id}`);
    return response.data;
  },

  async searchLedgers(query, companyId) {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (companyId) params.append("company_id", companyId);

    const response = await api.get(`/api/ledger/search?${params.toString()}`);
    return response.data.ledgers;
  },
};
