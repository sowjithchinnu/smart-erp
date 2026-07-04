import api from "./api";

export const invoiceService = {
  async getSalesInvoice(id) {
    const response = await api.get(`/api/invoice/sales/${id}`);
    return response.data.invoice;
  },
  async downloadSalesInvoice(id) {
  const response = await api.get(`/api/invoice/sales/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `Invoice-${id}.pdf`);

  document.body.appendChild(link);
  link.click();
  link.remove();
},
};