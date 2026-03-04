import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./ValveTypes.css"; // Reusing the same styles

function ParameterValues() {
  const { parameterId } = useParams();
  const [parameter, setParameter] = useState(null);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [valueToDelete, setValueToDelete] = useState(null);
  const [formData, setFormData] = useState({ value: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchParameterAndValues();
  }, [parameterId]);

  const fetchParameterAndValues = async () => {
    try {
      setLoading(true);
      // Fetch parameter details
      const paramResponse = await axios.get(`/parameters/${parameterId}`);
      setParameter(paramResponse.data.data);
      
      // Fetch parameter values
      const valuesResponse = await axios.get(`/parameters/${parameterId}/values`);
      setValues(valuesResponse.data.data || []);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = (value = null) => {
    setEditMode(!!value);
    setFormData(value ? { value: value.value, id: value.id } : { value: "" });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/parameter-values/${formData.id}`, { value: formData.value });
        showMessage("success", "Value updated successfully");
      } else {
        await axios.post(`/parameters/${parameterId}/values`, { value: formData.value });
        showMessage("success", "Value created successfully");
      }
      setShowModal(false);
      fetchParameterAndValues();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/parameter-values/${valueToDelete.id}`);
      showMessage("success", "Value deleted successfully");
      setValueToDelete(null);
      fetchParameterAndValues();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete value");
    }
  };

  const handleBack = () => {
    navigate("/admin/valve-config/parameters");
  };

  return (
    <div className="valve-types-container">
      <div className="valve-types-header">
        <div>
          <button className="btn-back" onClick={handleBack}>
            ← Back
          </button>
          <h1 className="valve-types-title">Parameter Value List</h1>
          <p className="valve-types-subtitle">
            Valve Configuration &gt; Parameters &gt; {parameter?.name || "Loading..."}
          </p>
        </div>
        <button className="btn-add-valve" onClick={() => openModal()}>
          + Add Value
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Loading values...</div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="valve-types-table">
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Created At</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {values.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data-row">
                      No values found. Add a value to get started.
                    </td>
                  </tr>
                ) : (
                  values.map((value) => (
                    <tr key={value.id}>
                      <td className="valve-name-cell">{value.value}</td>
                      <td>
                        {new Date(value.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        {new Date(value.updated_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => openModal(value)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setValueToDelete(value)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editMode ? "Edit Value" : "Add Value"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Value <span className="required-mark">*</span>
                </label>
                <input
                  className="form-input"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="e.g., ASTM A216 Gr.WCB"
                  required
                  maxLength={200}
                />
                <span className="help-text">
                  Maximum 200 characters. Must be unique within this parameter (case-insensitive).
                </span>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {valueToDelete && (
        <div className="modal-overlay" onClick={() => setValueToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">Confirm Deletion</h2>
            <p className="confirm-text">
              Are you sure you want to delete the value "
              <strong>{valueToDelete.value}</strong>"?
            </p>
            <div className="confirm-info">
              ⚠️ If this value is used in existing TCDS records, you will not be able to delete it.
            </div>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setValueToDelete(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParameterValues;
