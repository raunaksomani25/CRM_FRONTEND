import { useEffect, useState } from "react";
import api from "../utils/axios";
import Layout from "./Layout";

function Popup({ type = "error", message, onClose }) {
  if (!message) return null;

  const colors = {
    error: "#dc3545", 
    success: "#28a745", 
  };

  const style = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    background: colors[type] || "#333",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: 6,
    zIndex: 2000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    minWidth: "250px",
    maxWidth: "350px",
    cursor: "pointer",
  };

  return (
    <div style={style} onClick={onClose}>
      {type === "error" ? <strong>Error: </strong> : <strong>Success: </strong>}
      {message}
    </div>
  );
}

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    externalId: "",
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ type, message });
  };

  useEffect(() => {
    if (popup.message) {
      const timer = setTimeout(() => setPopup({ type: "", message: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/customers", form);
      showPopup("success", "Customer created!");
      setForm({ externalId: "", name: "", email: "" });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      showPopup("error", "Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Layout>
        <h1 className="mb-4 text-center">Customers</h1>
        <form
          onSubmit={handleSubmit}
          className="row g-3 mb-5 align-items-end justify-content-center"
        >
          <div className="col-md-3">
            <input
              type="text"
              placeholder="External ID"
              value={form.externalId}
              onChange={(e) => setForm({ ...form, externalId: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <button
              type="submit"
              className="btn btn-primary w-100 text-nowrap"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </form>

        <div className="table-responsive">
          {customers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: "2rem" }}>👥</div>
              <p className="mt-2">
                No customers found. Add your first customer above.
              </p>
            </div>
          ) : (
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>External ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Spend</th>
                  <th>Visits</th>
                  <th>Last Order Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.externalId}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>₹ {c.totalSpend || "0.00"}</td>
                    <td>{c.visits || "0"}</td>
                    <td>
                      {c.lastOrderDate
                        ? new Date(c.lastOrderDate).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup({ type: "", message: "" })}
        />
      </Layout>
    </div>
  );
}

export default Customers;
