import { useEffect, useState } from "react";

function App() {
  const [invoices, setInvoices] = useState([]);

  const [formData, setFormData] = useState({
    business_name: "",
    business_email: "",
    client_name: "",
    client_email: "",
    invoice_number: "",
    invoice_date: "",
    due_date: "",
    subtotal: "",
    tax: "",
    total: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    fetch("http://127.0.0.1:8000/api/invoices/")
      .then((res) => res.json())
      .then((data) => setInvoices(data));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/invoices/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create invoice");
        }
        return res.json();
      })
      .then(() => {
        setFormData({
          business_name: "",
          business_email: "",
          client_name: "",
          client_email: "",
          invoice_number: "",
          invoice_date: "",
          due_date: "",
          subtotal: "",
          tax: "",
          total: "",
        });
        fetchInvoices();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h1>Invoice Generator</h1>

      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input name="business_name" placeholder="Business Name" value={formData.business_name} onChange={handleChange} required />
        <br /><br />
        <input name="business_email" placeholder="Business Email" value={formData.business_email} onChange={handleChange} required />
        <br /><br />
        <input name="client_name" placeholder="Client Name" value={formData.client_name} onChange={handleChange} required />
        <br /><br />
        <input name="client_email" placeholder="Client Email" value={formData.client_email} onChange={handleChange} required />
        <br /><br />
        <input name="invoice_number" placeholder="Invoice Number" value={formData.invoice_number} onChange={handleChange} required />
        <br /><br />
        <input type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} required />
        <br /><br />
        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
        <br /><br />
        <input name="subtotal" placeholder="Subtotal" value={formData.subtotal} onChange={handleChange} required />
        <br /><br />
        <input name="tax" placeholder="Tax" value={formData.tax} onChange={handleChange} required />
        <br /><br />
        <input name="total" placeholder="Total" value={formData.total} onChange={handleChange} required />
        <br /><br />
        <button type="submit">Create Invoice</button>
      </form>

      <hr />

      <h2>Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id} style={{ marginBottom: "10px" }}>
  <strong>{invoice.invoice_number}</strong> — {invoice.client_name} — ₹{invoice.total}
  <br />
  <a
    href={`http://127.0.0.1:8000/api/invoices/${invoice.id}/pdf/`}
    target="_blank"
    rel="noopener noreferrer"
  >
    Download PDF
  </a>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;