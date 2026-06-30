import api from "./api";

export const companyService = {
  async getCompanies() {
  const response = await api.get("/api/company");
  return response.data.companies;
},

  async getCompanyById(id) {
    const response = await api.get(`/api/company/${id}`);
    return response.data;
  },

  async createCompany(companyData) {
    const response = await api.post("/api/company", companyData);
    return response.data;
  },

  async updateCompany(id, companyData) {
    const response = await api.put(`/api/company/${id}`, companyData);
    return response.data;
  },

  async deleteCompany(id) {
    const response = await api.delete(`/api/company/${id}`);
    return response.data;
  },
};