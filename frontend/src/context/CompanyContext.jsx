"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { companyService } from "../services/companyService";

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const data = await companyService.getCompanies();

console.log("DATA:", data);
console.log("TYPE:", typeof data);
console.log("IS ARRAY:", Array.isArray(data));

setCompanies(data);

    } catch (err) {
      setError(err.message || "Failed to load companies");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    setLoading(true);
    setError(null);
    try {
      const newCompany = await companyService.createCompany(companyData);
      setCompanies([...companies, newCompany]);
      return newCompany;
    } catch (err) {
      setError(err.message || "Failed to create company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id, companyData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCompany = await companyService.updateCompany(id, companyData);
      setCompanies(
        companies.map((company) =>
          company.id === id ? updatedCompany : company
        )
      );
      if (selectedCompany?.id === id) {
        setSelectedCompany(updatedCompany);
      }
      return updatedCompany;
    } catch (err) {
      setError(err.message || "Failed to update company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await companyService.deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
  };

  const fetchCompanies = async () => {
    await loadCompanies();
  };

  useEffect(() => {
  loadCompanies();
}, []);
  const value = {
    companies,
    selectedCompany,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    selectCompany,
    fetchCompanies,
    loadCompanies,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};