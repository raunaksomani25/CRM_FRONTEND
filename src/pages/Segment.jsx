import { useState, useEffect } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
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

function Segments() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logicalOperator, setLogicalOperator] = useState("AND");
  const [rules, setRules] = useState([
    { field: "totalSpend", operator: ">", value: "" },
  ]);
  const [audienceCount, setAudienceCount] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRuleChange = (index, key, val) => {
    const updated = [...rules];
    updated[index][key] = val;
    setRules(updated);
  };

  const addRule = () =>
    setRules([...rules, { field: "totalSpend", operator: ">", value: "" }]);

  const removeRule = (index) =>
    setRules(rules.filter((_, i) => i !== index));

  const previewAudience = async () => {
    try {
      const res = await api.post("/segments/preview", { rules, logicalOperator });
      setAudienceCount(res.data.audienceCount);
    } catch (err) {
      console.error(err);
      setError("Failed to preview audience");
    }
  };

  const viewMembers = async () => {
    try {
      const res = await api.post("/segments/members", { rules, logicalOperator });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch members");
    }
  };

  const saveSegment = async () => {
    try {
      if (!name) {
        setError("Segment name is required");
        return;
      }
      const segmentData = { name, description, rules, logicalOperator };
      await api.post("/segments", segmentData);
      navigate("/campaigns");
    } catch (err) {
      console.error(err);
      setError("Failed to save segment");
    }
  };

  return (
    <div className="container py-5">
      <Layout>
        <h1 className="mb-4">Create Audience Segment</h1>
        <div className="mx-3">
          <label className="form-label">Segment Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter segment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mx-3">
          <label className="form-label">Description (optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mx-4">
          <label className="form-label">Combine rules with</label>
          <select
            className="form-select"
            value={logicalOperator}
            onChange={(e) => setLogicalOperator(e.target.value)}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
        <div className="mx-4">
          <label className="form-label">Rules</label>
          {rules.map((r, i) => (
            <div key={i} className="row g-3 align-items-center mb-3">
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={r.field}
                  onChange={(e) => handleRuleChange(i, "field", e.target.value)}
                >
                  <option value="totalSpend">Total Spend</option>
                  <option value="visits">Visits</option>
                  <option value="lastOrderDate">Inactive Days</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={r.operator}
                  onChange={(e) => handleRuleChange(i, "operator", e.target.value)}
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="==">=</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value"
                  value={r.value}
                  onChange={(e) => handleRuleChange(i, "value", e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeRule(i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={addRule}>
            + Add Rule
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={previewAudience}
          >
            Preview Audience
          </button>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={viewMembers}
          >
            View Members
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={saveSegment}
          >
            Save Segment
          </button>
        </div>
        {audienceCount !== null && (
          <div className="alert alert-primary text-center">
            <h4 className="mb-1">{audienceCount.toLocaleString()}</h4>
            <small>customers match this segment</small>
          </div>
        )}
        {members.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-3">Segment Members</h2>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Spend</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>${m.totalSpend?.toLocaleString()}</td>
                    <td>{m.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
      <ErrorPopup message={error} onClose={() => setError("")} />
    </div>
  );
}

export default Segments;
