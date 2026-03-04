import { useNavigate } from "react-router-dom";
import "./ValveConfiguration.css";

function ValveConfiguration() {
  const navigate = useNavigate();

  return (
    <div className="valve-config-container">
      <h1 className="valve-config-title">Valve Configuration Master</h1>
      <p className="valve-config-description">
        Configure valve types, parameters, and specifications
      </p>

      <div className="config-cards">
        <div
          className="config-card"
          onClick={() => navigate("/admin/valve-config/valve-types")}
        >
          <div className="config-card-icon"></div>
          <h3 className="config-card-title">Valve Types</h3>
          <p className="config-card-description">
            Manage valve types and their associated parameters
          </p>
          <button className="config-card-button">Manage →</button>
        </div>

        {/* Future cards can be added here */}
        <div
          className="config-card"
          onClick={() => navigate("/admin/valve-config/parameters")}
        >
          <div className="config-card-icon"></div>
          <h3 className="config-card-title">Parameters</h3>
          <p className="config-card-description">
            Configure valve parameters and specifications
          </p>
          <button className="config-card-button">Manage →</button>
        </div>
      </div>
    </div>
  );
}

export default ValveConfiguration;
