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

function Modal({ title, show, onClose, children }) {
  if (!show) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };

  const boxStyle = {
    width: "min(1100px, 95%)",
    maxHeight: "90vh",
    background: "#fff",
    borderRadius: 8,
    padding: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const bodyStyle = {
    overflowY: "auto",
    paddingRight: "0.25rem",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="m-0">{title}</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    segmentId: "",
    message: "",
  });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [objective, setObjective] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);

  const [error, setError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchData = async () => {
    try {
      const [campaignRes, segmentRes] = await Promise.all([
        api.get("/campaigns"),
        api.get("/segments"),
      ]);
      setCampaigns(campaignRes.data);
      setSegments(segmentRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch campaigns or segments");
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const locked = showLogsModal || showAiModal;
    document.body.style.overflow = locked ? "hidden" : "";
  }, [showLogsModal, showAiModal]);

  const handleChange = (e) => {
    setNewCampaign({ ...newCampaign, [e.target.name]: e.target.value });
  };

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.segmentId || !newCampaign.message) {
      setError("All campaign fields are required");
      return;
    }
    try {
      setCreateLoading(true);
      await api.post("/campaigns", newCampaign);
      await fetchData();
      setNewCampaign({ name: "", segmentId: "", message: "" });
      setObjective("");
      setAiSuggestions([]);
      setShowAiModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create campaign");
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchAiSuggestions = async () => {
    if (!objective) return setError("Enter a campaign objective");
    try {
      setAiLoading(true);
      const res = await api.post("/ai/messages", { objective });

      let suggestions = res.data?.suggestions || [];
      if (typeof suggestions === "string") {
        try {
          suggestions = JSON.parse(suggestions);
        } catch {
          suggestions = [String(suggestions)];
        }
      }
      if (!Array.isArray(suggestions)) suggestions = [String(suggestions)];

      suggestions = suggestions
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0);

      setAiSuggestions(suggestions);
      setShowAiModal(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI suggestions");
    } finally {
      setAiLoading(false);
    }
  };

  const useAiSuggestion = (message) => {
    setNewCampaign({ ...newCampaign, message });
    setShowAiModal(false);
  };

  const viewLogs = async (campaignId) => {
    try {
      const res = await api.get(`/campaigns/${campaignId}/logs`);
      setSelectedLogs(Array.isArray(res.data) ? res.data : []);
      setShowLogsModal(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch campaign logs");
      setSelectedLogs([]);
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: "100vh" }}>
      <Layout>
        <h1 className="mb-4 text-center">Campaigns</h1>
        <div className="mx-5">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="name"
                value={newCampaign.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Campaign Name"
              />
            </div>
            <div className="col-md-4">
              <select
                name="segmentId"
                value={newCampaign.segmentId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Segment</option>
                {segments.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (Audience: {s.audienceCount || s.audienceSize || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="form-control"
                placeholder="Campaign Objective (AI suggestions)"
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-secondary w-100"
                onClick={fetchAiSuggestions}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Generating...
                  </>
                ) : (
                  "Get AI Suggestions"
                )}
              </button>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-md-8">
              <textarea
                name="message"
                value={newCampaign.message}
                onChange={handleChange}
                className="form-control"
                placeholder="Message"
                rows="3"
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-success w-100"
                onClick={createCampaign}
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </button>
            </div>
          </div>
        </div>
        <br></br>
        <h2 className="mx-3">Campaign History</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Segment</th>
                <th>Audience Size</th>
                <th>Sent</th>
                <th>Failed</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.segment?.name || "N/A"}</td>
                  <td>{c.audienceSize}</td>
                  <td>{c.sentCount}</td>
                  <td>{c.failedCount}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => viewLogs(c._id)}
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          title="Delivery Logs"
          show={showLogsModal}
          onClose={() => setShowLogsModal(false)}
        >
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedLogs) && selectedLogs.length > 0 ? (
                  selectedLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.customer?.name || log.customerId}</td>
                      <td>{log.message || "N/A"}</td>
                      <td>{log.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>

        <Modal
          title="AI Suggestions"
          show={showAiModal && aiSuggestions.length > 0}
          onClose={() => setShowAiModal(false)}
        >
          <div className="list-group">
            {aiSuggestions.map((msg, idx) => (
              <div
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div className="me-3" style={{ flex: 1 }}>
                  <p className="mb-0">{msg}</p>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => useAiSuggestion(msg)}
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal>

        <ErrorPopup message={error} onClose={() => setError("")} />
      </Layout>
    </div>
  );
}

export default Campaigns;
