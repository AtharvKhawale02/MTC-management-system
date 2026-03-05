import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./AccessoryParameters.css";

function AccessoryParameters() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState(null);
  const [linkedParameters, setLinkedParameters] = useState([]);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch accessory details
      const accessoryRes = await axios.get(`/accessories/${id}`);
      setAccessory(accessoryRes.data.data);
      
      // Fetch linked parameters
      const linkedRes = await axios.get(`/accessories/${id}/parameters`);
      setLinkedParameters(linkedRes.data.data || []);
      
      // Fetch available parameters
      const availableRes = await axios.get(`/accessories/${id}/available-parameters`);
      setAvailableParameters(availableRes.data.data || []);
      
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleLinkParameter = async (e) => {
    e.preventDefault();
    
    if (!selectedParameter) {
      showMessage("error", "Please select a parameter");
      return;
    }

    try {
      await axios.post(`/accessories/${id}/parameters`, {
        parameter_id: parseInt(selectedParameter)
      });
      
      showMessage("success", "Parameter linked successfully");
      setShowAddModal(false);
      setSelectedParameter("");
      fetchData();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to link parameter");
      }
    }
  };

  const handleUnlinkParameter = async (parameterId) => {
    if (!window.confirm("Are you sure you want to remove this parameter from this accessory?")) {
      return;
    }

    try {
      await axios.delete(`/accessories/${id}/parameters/${parameterId}`);
      showMessage("success", "Parameter unlinked successfully");
      fetchData();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to unlink parameter");
      }
    }
  };

  if (loading) {
    return (
      <div className="accessory-params-container">
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="accessory-params-container">
      <div className="accessory-params-header">
        <div>
          <button className="btn-back" onClick={() => navigate("/admin/accessories-config/accessories")}>
            ← Back to Accessories
          </button>
          <h1 className="accessory-params-title">
            {accessory?.name} - Parameters
          </h1>
          <p className="accessory-params-subtitle">
            Manage parameters for this accessory
          </p>
        </div>
        <button
          className="btn-add-param"
          onClick={() => setShowAddModal(true)}
          disabled={availableParameters.length === 0}
        >
          + Add Parameter
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="params-section">
        <h3 className="section-title">
          Linked Parameters ({linkedParameters.length})
        </h3>
        {linkedParameters.length === 0 ? (
          <div className="empty-state">
            <p>No parameters linked to this accessory yet.</p>
            <p>Click "Add Parameter" to link existing parameters.</p>
          </div>
        ) : (
          <div className="table-card">
            <table className="params-table">
              <thead>
                <tr>
                  <th>Parameter Name</th>
                  <th>Type</th>
                  <th>Mandatory</th>
                  <th>Linked Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkedParameters.map((param) => (
                  <tr key={param.id}>
                    <td className="param-name">{param.name}</td>
                    <td>
                      <span className="type-badge">{param.type}</span>
                    </td>
                    <td>
                      <span className={`mandatory-badge ${param.is_mandatory ? 'yes' : 'no'}`}>
                        {param.is_mandatory ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      {new Date(param.linked_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => handleUnlinkParameter(param.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {availableParameters.length > 0 && (
        <div className="available-section">
          <h3 className="section-title">
            Available Parameters ({availableParameters.length})
          </h3>
          <div className="available-params-grid">
            {availableParameters.map((param) => (
              <div key={param.id} className="available-param-card">
                <div className="param-info">
                  <h4>{param.name}</h4>
                  <div className="param-meta">
                    <span className="type-badge">{param.type}</span>
                    <span className={`mandatory-badge ${param.is_mandatory ? 'yes' : 'no'}`}>
                      {param.is_mandatory ? "Mandatory" : "Optional"}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-add-small"
                  onClick={() => {
                    setSelectedParameter(param.id.toString());
                    setShowAddModal(true);
                  }}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Parameter</h2>
            <form onSubmit={handleLinkParameter}>
              <div className="form-group">
                <label className="form-label">
                  Select Parameter <span className="required-mark">*</span>
                </label>
                <select
                  className="form-select"
                  value={selectedParameter}
                  onChange={(e) => setSelectedParameter(e.target.value)}
                  required
                >
                  <option value="">Choose a parameter...</option>
                  {availableParameters.map((param) => (
                    <option key={param.id} value={param.id}>
                      {param.name} ({param.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedParameter("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
                  Add Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessoryParameters;
