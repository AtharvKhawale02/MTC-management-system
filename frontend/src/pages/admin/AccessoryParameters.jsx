import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./AccessoryParameters.css";

function AccessoryParameters() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState(null);
  const [linkedParameters, setLinkedParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [availableParameters, setAvailableParameters] = useState([]);
  const [selectedParameterId, setSelectedParameterId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "dropdown",
    is_mandatory: false,
    validation_rule: "Max 200 characters"
  });
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

  const fetchAvailableParameters = async () => {
    try {
      const response = await axios.get(`/accessories/${id}/available-parameters`);
      setAvailableParameters(response.data.data || []);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to load available parameters");
    }
  };

  const handleOpenAddExistingModal = async () => {
    setShowAddExistingModal(true);
    await fetchAvailableParameters();
  };

  const handleAddExistingParameter = async (e) => {
    e.preventDefault();
    
    if (!selectedParameterId) {
      showMessage("error", "Please select a parameter");
      return;
    }

    try {
      await axios.post(`/accessories/${id}/parameters`, {
        parameter_id: selectedParameterId
      });
      
      showMessage("success", "Parameter linked successfully");
      setShowAddExistingModal(false);
      setSelectedParameterId("");
      fetchData();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to link parameter");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleCreateParameter = async (e) => {
    e.preventDefault();
    
    try {
      // First, create the parameter
      const createRes = await axios.post("/parameters", formData);
      const newParameterId = createRes.data.data.id;
      
      // Then, link it to the accessory
      await axios.post(`/accessories/${id}/parameters`, {
        parameter_id: newParameterId
      });
      
      showMessage("success", "Parameter created and linked successfully");
      setShowCreateModal(false);
      setFormData({
        name: "",
        type: "dropdown",
        is_mandatory: false,
        validation_rule: "Max 200 characters"
      });
      fetchData();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to create parameter");
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
      <button className="btn-back" onClick={() => navigate("/admin/accessories-config/accessories")}>
        ← Back
      </button>

      <div className="accessory-params-header">
        <div>
          <h1 className="accessory-params-title">
            {accessory?.name} - Parameters
          </h1>
          <p className="accessory-params-subtitle">
            Manage parameters for this accessory
          </p>
        </div>
        <div className="header-buttons">
          <button
            className="btn-add-existing"
            onClick={handleOpenAddExistingModal}
          >
            + Add Parameter
          </button>
          <button
            className="btn-add-param"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Parameter
          </button>
        </div>
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
            <p>Click "Create Parameter" to add new parameters.</p>
          </div>
        ) : (
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
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Parameter</h2>
            <form onSubmit={handleCreateParameter}>
              <div className="form-group">
                <label className="form-label">
                  Parameter Name <span className="required-mark">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter parameter name"
                  required
                  maxLength={100}
                />
                <span className="help-text">Maximum 100 characters</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Type <span className="required-mark">*</span>
                </label>
                <select
                  className="form-input"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label checkbox-label">
                  <input
                    type="checkbox"
                    name="is_mandatory"
                    checked={formData.is_mandatory}
                    onChange={handleInputChange}
                  />
                  <span>Mandatory Field</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Validation Rule
                </label>
                <input
                  className="form-input"
                  name="validation_rule"
                  value={formData.validation_rule}
                  onChange={handleInputChange}
                  placeholder="e.g., Max 200 characters"
                  maxLength={500}
                />
                <span className="help-text">Maximum 500 characters</span>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      name: "",
                      type: "dropdown",
                      is_mandatory: false,
                      validation_rule: "Max 200 characters"
                    });
                  }}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
                  Create Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddExistingModal && (
        <div className="modal-overlay" onClick={() => setShowAddExistingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Existing Parameter</h2>
            <form onSubmit={handleAddExistingParameter}>
              <div className="form-group">
                <label className="form-label">
                  Select Parameter <span className="required-mark">*</span>
                </label>
                {availableParameters.length === 0 ? (
                  <div className="empty-state-small">
                    <p>No available parameters to add.</p>
                    <p>All existing parameters are already linked to this accessory.</p>
                  </div>
                ) : (
                  <>
                    <select
                      className="form-input"
                      value={selectedParameterId}
                      onChange={(e) => setSelectedParameterId(e.target.value)}
                      required
                    >
                      <option value="">-- Select a parameter --</option>
                      {availableParameters.map((param) => (
                        <option key={param.id} value={param.id}>
                          {param.name} ({param.type})
                        </option>
                      ))}
                    </select>
                    <span className="help-text">
                      Select from previously created parameters
                    </span>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => {
                    setShowAddExistingModal(false);
                    setSelectedParameterId("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-submit" 
                  type="submit"
                  disabled={availableParameters.length === 0}
                >
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
