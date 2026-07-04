"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { invoiceService } from "../../services/invoiceService";
import Invoice from "../../components/invoice/Invoice";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      setInvoice(null);
      setInvoiceId(null);
      setError("Invoice not found.");
      setLoading(false);
      return;
    }

    setInvoiceId(id);
    setLoading(true);
    setError("");

    invoiceService
      .getSalesInvoice(id)
      .then((data) => {
        setInvoice(data);
      })
      .catch(() => {
        setInvoice(null);
        setError("Invoice not found.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return null;
  }

  return <Invoice invoice={invoice} invoiceId={invoiceId} error={error} />;
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Loading invoice...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}