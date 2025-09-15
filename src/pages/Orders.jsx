import { useEffect, useState } from "react";
import api from "../utils/axios";
import Layout from "./Layout";
function ErrorPopup({ message, onClose }) {
  if (!message) return null;

  const style = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    background: "#dc3545",
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
      <strong>Error: </strong> {message}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    externalOrderId: "",
    customerExternalId: "",
    amount: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/orders", form);
      setForm({ externalOrderId: "", customerExternalId: "", amount: "" });
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <Layout>
        <h1 className="mb-4 text-center">Orders</h1>
        <form
          onSubmit={handleSubmit}
          className="row g-3 mb-5 align-items-end justify-content-center"
        >
          <div className="col-md-3">
            <input
              name="externalOrderId"
              placeholder="External Order ID"
              value={form.externalOrderId}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="customerExternalId"
              placeholder="Customer External ID"
              value={form.customerExternalId}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <button
              type="submit"
              className="btn btn-success w-100 text-nowrap"
            >
              Create Order
            </button>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer External ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.externalOrderId}</td>
                  <td>{o.customerExternalId}</td>
                  <td>{o.amount}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
      <ErrorPopup message={error} onClose={() => setError("")} />
    </div>
  );
}

export default Orders;
