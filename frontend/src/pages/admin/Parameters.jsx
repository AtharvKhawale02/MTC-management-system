import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./ValveTypes.css"; // Reusing the same styles

const defaultForm = { 
  name: "", 
  type: "Dropdown", 
  is_mandatory: false,
  validation_rule: "Max 200 characters"
};

function Parameters() {
  const [searchParams] = useSearchParams();
  const valveId = searchParams.get('valveId');
  
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [parameterToDelete, setParameterToDelete] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Dropdown values management
  const [dropdownValues, setDropdownValues] = useState([""]);
  const [loadingValues, setLoadingValues] = useState(false);
  
  // Valve-specific states
  const [valveType, setValveType] = useState(null);
  const [editingValveName, setEditingValveName] = useState(false);
  const [valveNameInput, setValveNameInput] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (valveId) {
      fetchValveType();
      fetchValveParameters();
    } else {
      fetchParameters();
    }
  }, [valveId]);

  const fetchValveType = async () => {
    try {
      const response = await axios.get(`/valve-types/${valveId}`);
      const valve = response.data.data;
      setValveType(valve);
      setValveNameInput(valve.name);
    } catch (error) {
      showMessage("error", "Failed to load valve type details");
    }
  };

  const fetchValveParameters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/valve-types/${valveId}/parameters`);
      setParameters(response.data.data || []);
    } catch (error) {
      showMessage("error", "Failed to load valve parameters");
    } finally {
      setLoading(false);
    }
  };

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/parameters");
      setParameters(response.data.data || []);
    } catch {
      showMessage("error", "Failed to load parameters");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = async (parameter = null) => {
    setEditMode(!!parameter);
    setFormData(parameter ? { ...parameter } : defaultForm);
    
    // Load existing values if editing a dropdown parameter
    if (parameter && parameter.type && parameter.type.toLowerCase() === 'dropdown') {
      setLoadingValues(true);
      try {
        const endpoint = valveId 
          ? `/valve-types/${valveId}/parameters/${parameter.id}/values`
          : `/parameters/${parameter.id}/values`;
        const response = await axios.get(endpoint);
        const values = response.data.data || [];
        setDropdownValues(values.length > 0 ? values.map(v => v.value) : [""]);
      } catch (error) {
        setDropdownValues([""]);
      } finally {
        setLoadingValues(false);
      }
    } else {
      setDropdownValues([""]);
    }
    
    setShowModal(true);
  };

  const handleValueChange = (index, value) => {
    const newValues = [...dropdownValues];
    newValues[index] = value;
    setDropdownValues(newValues);
  };

  const addValueField = () => {
    setDropdownValues([...dropdownValues, ""]);
  };

  const removeValueField = (index) => {
    if (dropdownValues.length > 1) {
      const newValues = dropdownValues.filter((_, i) => i !== index);
      setDropdownValues(newValues);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dropdown values if type is dropdown
    if (formData.type && formData.type.toLowerCase() === 'dropdown') {
      const validValues = dropdownValues.filter(v => v.trim() !== '');
      if (validValues.length === 0) {
        showMessage("error", "Please add at least one value for dropdown parameter");
        return;
      }
    }
    
    try {
      let parameterId = formData.id;
      
      if (valveId) {
        // For valve-specific parameters (valve_type_parameters table)
        // This table only has: name, input_type columns
        if (editMode) {
          await axios.put(`/valve-types/${valveId}/parameters/${formData.id}`, {
            name: formData.name,
            type: formData.type
          });
          showMessage("success", "Parameter updated successfully");
        } else {
          const response = await axios.post(`/valve-types/${valveId}/parameters`, {
            name: formData.name,
            type: formData.type
          });
          parameterId = response.data.data?.id;
          showMessage("success", "Parameter created successfully");
        }
        
        // Save dropdown values if type is dropdown
        if (formData.type && formData.type.toLowerCase() === 'dropdown' && parameterId) {
          await saveDropdownValues(parameterId, true);
        }
        
        fetchValveParameters();
      } else {
        // For global parameters (parameters table)
        // This table has: name, type, is_mandatory, validation_rule columns
        if (editMode) {
          await axios.put(`/parameters/${formData.id}`, formData);
          showMessage("success", "Parameter updated successfully");
        } else {
          const response = await axios.post("/parameters", formData);
          parameterId = response.data.data?.id;
          showMessage("success", "Parameter created successfully");
        }
        
        // Save dropdown values if type is dropdown
        if (formData.type && formData.type.toLowerCase() === 'dropdown' && parameterId) {
          await saveDropdownValues(parameterId, false);
        }
        
        fetchParameters();
      }
      setShowModal(false);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Error occurred");
    }
  };
  
  const saveDropdownValues = async (parameterId, isValveSpecific) => {
    const validValues = dropdownValues.filter(v => v.trim() !== '');
    
    if (validValues.length === 0) return;
    
    try {
      // First, delete all existing values if editing
      if (editMode) {
        const endpoint = isValveSpecific
          ? `/valve-types/${valveId}/parameters/${parameterId}/values`
          : `/parameters/${parameterId}/values`;
        
        // Get existing values
        const response = await axios.get(endpoint);
        const existingValues = response.data.data || [];
        
        // Delete each existing value
        for (const val of existingValues) {
          await axios.delete(`${endpoint}/${val.id}`);
        }
      }
      
      // Add new values
      const endpoint = isValveSpecific
        ? `/valve-types/${valveId}/parameters/${parameterId}/values`
        : `/parameters/${parameterId}/values`;
      
      for (const value of validValues) {
        await axios.post(endpoint, { value: value.trim() });
      }
    } catch (error) {
      console.error("Error saving dropdown values:", error);
      showMessage("error", "Parameter saved but failed to save some values");
    }
  };

  const handleDelete = async () => {
    try {
      if (valveId) {
        await axios.delete(`/valve-types/${valveId}/parameters/${parameterToDelete.id}`);
      } else {
        await axios.delete(`/parameters/${parameterToDelete.id}`);
      }
      showMessage("success", "Parameter deleted successfully");
      setParameterToDelete(null);
      valveId ? fetchValveParameters() : fetchParameters();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete parameter");
    }
  };

  const handleEdit = (parameter) => {
    // Open modal for editing all parameter types
    openModal(parameter);
  };

  const handleSaveValveName = async () => {
    if (!valveNameInput.trim()) {
      showMessage("error", "Valve name cannot be empty");
      return;
    }
    
    try {
      await axios.put(`/valve-types/${valveId}`, { name: valveNameInput });
      showMessage("success", "Valve type name updated successfully");
      setEditingValveName(false);
      fetchValveType();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to update valve name");
    }
  };

  const handleCancelValveName = () => {
    setValveNameInput(valveType.name);
    setEditingValveName(false);
  };

  return (
    <div className="valve-types-container">
      {/* Valve Name Editor (only for valve-specific view) */}
      {valveId && valveType && (
        <div className="valve-name-editor">
          <button 
            className="btn-back"
            onClick={() => navigate('/admin/valve-config')}
          >
            ← Back to Valve Types
          </button>
          
          <div className="valve-name-section">
            <label className="valve-name-label">Valve Type:</label>
            {editingValveName ? (
              <div className="valve-name-edit-group">
                <input
                  type="text"
                  className="valve-name-input"
                  value={valveNameInput}
                  onChange={(e) => setValveNameInput(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
                <button 
                  className="btn-save-valve-name"
                  onClick={handleSaveValveName}
                >
                  Save
                </button>
                <button 
                  className="btn-cancel-valve-name"
                  onClick={handleCancelValveName}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="valve-name-display-group">
                <h2 className="valve-name-display">{valveType.name}</h2>
                <button 
                  className="btn-edit-valve-name"
                  onClick={() => setEditingValveName(true)}
                >
                  ✎ Edit Name
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="valve-types-header">
        <div>
          <h1 className="valve-types-title">
            {valveId ? 'Valve Parameters' : 'Global Parameters'}
          </h1>
          <p className="valve-types-subtitle">
            {valveId 
              ? `Manage parameters for ${valveType?.name || 'this valve type'}` 
              : 'Manage Global Parameters'}
          </p>
        </div>
        <button className="btn-add-valve" onClick={() => openModal()}>
          + Add Parameter
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Loading parameters...</div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="valve-types-table">
              <thead>
                <tr>
                  <th>Parameter Name</th>
                  <th>Type</th>
                  {!valveId && <th>Mandatory</th>}
                  <th>No. of Values</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parameters.length === 0 ? (
                  <tr>
                    <td colSpan={valveId ? "5" : "6"} className="no-data-row">
                      No parameters found
                    </td>
                  </tr>
                ) : (
                  parameters.map((parameter) => (
                    <tr key={parameter.id}>
                      <td className="valve-name-cell">{parameter.name}</td>
                      <td>
                        <span className={`type-badge type-${parameter.type}`}>
                          {parameter.type}
                        </span>
                      </td>
                      {!valveId && (
                        <td>
                          <span className={`mandatory-badge ${parameter.is_mandatory ? 'mandatory-yes' : 'mandatory-no'}`}>
                            {parameter.is_mandatory ? 'Yes' : 'No'}
                          </span>
                        </td>
                      )}
                      <td>
                        {parameter.type && parameter.type.toLowerCase() === 'dropdown' ? (
                          <span className="parameter-count-badge">
                            {parameter.value_count !== undefined ? parameter.value_count : '0'}
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {new Date(parameter.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(parameter)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setParameterToDelete(parameter)}
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
              {editMode ? "Edit Parameter" : "Create New Parameter"}
            </h2>
            <form onSubmit={handleSubmit}>
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
                  <option value="Text">Text</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Number">Number</option>
                  <option value="Date">Date</option>
                </select>
              </div>

              {/* Dropdown Values Section */}
                {formData.type && formData.type.toLowerCase() === 'dropdown' && (
                <div className="form-group">
                  <label className="form-label">
                    Values <span className="required-mark">*</span>
                  </label>
                  {loadingValues ? (
                    <div className="loading-values">Loading values...</div>
                  ) : (
                    <div className="dropdown-values-container">
                      {dropdownValues.map((value, index) => (
                        <div key={index} className="value-input-row">
                          <input
                            className="form-input value-input"
                            type="text"
                            value={value}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            placeholder={`Value ${index + 1}`}
                            maxLength={100}
                          />
                          {dropdownValues.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-value"
                              onClick={() => removeValueField(index)}
                              title="Remove this value"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-value"
                        onClick={addValueField}
                      >
                        + Add Value
                      </button>
                    </div>
                  )}
                  <span className="help-text">Add dropdown options (at least one required)</span>
                </div>
              )}

              {!valveId && (
                <>
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
                </>
              )}

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {parameterToDelete && (
        <div className="modal-overlay" onClick={() => setParameterToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">Confirm Deletion</h2>
            <p className="confirm-text">
              Are you sure you want to delete the parameter "
              <strong>{parameterToDelete.name}</strong>"?
            </p>
            {parameterToDelete.value_count > 0 && (
              <div className="confirm-warning">
                ⚠️ This parameter has {parameterToDelete.value_count} associated
                value(s). All values will be deleted along with this parameter.
              </div>
            )}
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setParameterToDelete(null)}
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

export default Parameters;
