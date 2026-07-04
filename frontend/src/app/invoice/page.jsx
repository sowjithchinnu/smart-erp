"use client";

import { useEffect, useState } from "react";
import { invoiceService } from "../../services/invoiceService";
import Invoice from "../../components/invoice/Invoice";

export default function InvoicePage() {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    invoiceService.getSalesInvoice(1).then(setInvoice);
  }, []);

  return <Invoice invoice={invoice} />;
}