import api from "./api";

const buildSearchParams = (query, companyId) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (companyId) params.append("company_id", companyId);
  return params;
};

export const stockService = {
  async getCompanyStockGroups(companyId) {
    const response = await api.get(`/api/stock/groups/company/${companyId}`);
    return response.data.stockGroups;
  },

  async createStockGroup(companyId, stockGroupData) {
    const response = await api.post("/api/stock/groups", {
      ...stockGroupData,
      company_id: companyId,
    });
    return response.data;
  },

  async updateStockGroup(id, stockGroupData) {
    const response = await api.put(`/api/stock/groups/${id}`, stockGroupData);
    return response.data;
  },

  async deleteStockGroup(id) {
    const response = await api.delete(`/api/stock/groups/${id}`);
    return response.data;
  },

  async searchStockGroups(query, companyId) {
    const params = buildSearchParams(query, companyId);
    const response = await api.get(`/api/stock/groups/search?${params.toString()}`);
    return response.data.stockGroups;
  },

  async getCompanyUnits(companyId) {
    const response = await api.get(`/api/stock/units/company/${companyId}`);
    return response.data.units;
  },

  async createUnit(companyId, unitData) {
    const response = await api.post("/api/stock/units", {
      ...unitData,
      company_id: companyId,
    });
    return response.data;
  },

  async updateUnit(id, unitData) {
    const response = await api.put(`/api/stock/units/${id}`, unitData);
    return response.data;
  },

  async deleteUnit(id) {
    const response = await api.delete(`/api/stock/units/${id}`);
    return response.data;
  },

  async searchUnits(query, companyId) {
    const params = buildSearchParams(query, companyId);
    const response = await api.get(`/api/stock/units/search?${params.toString()}`);
    return response.data.units;
  },

  async getCompanyStockItems(companyId) {
    const response = await api.get(`/api/stock/items/company/${companyId}`);
    return response.data.stockItems;
  },

  async createStockItem(companyId, stockItemData) {
    const response = await api.post("/api/stock/items", {
      ...stockItemData,
      company_id: companyId,
    });
    return response.data;
  },

  async updateStockItem(id, stockItemData) {
    const response = await api.put(`/api/stock/items/${id}`, stockItemData);
    return response.data;
  },

  async deleteStockItem(id) {
    const response = await api.delete(`/api/stock/items/${id}`);
    return response.data;
  },

  async searchStockItems(query, companyId) {
    const params = buildSearchParams(query, companyId);
    const response = await api.get(`/api/stock/items/search?${params.toString()}`);
    return response.data.stockItems;
  },
};
