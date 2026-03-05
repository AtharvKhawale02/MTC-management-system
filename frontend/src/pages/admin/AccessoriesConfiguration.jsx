import { useNavigate } from "react-router-dom";
import "./AccessoriesConfiguration.css";

function AccessoriesConfiguration() {
  const navigate = useNavigate();

  return (
    <div className="accessories-config-container">
      <h1 className="accessories-config-title">Accessories Configuration Master</h1>
      <p className="accessories-config-description">
        Configure accessories and their associated parameters
      </p>

      <div className="config-cards">
        <div
          className="config-card"
          onClick={() => navigate("/admin/accessories-config/accessories")}
        >
          <div className="config-card-icon"></div>
          <h3 className="config-card-title">Accessories</h3>
          <p className="config-card-description">
            Manage accessories and their associated parameters
          </p>
          <button className="config-card-button">Manage →</button>
        </div>

        <div
          className="config-card"
          onClick={() => navigate("/admin/valve-config/parameters")}
        >
          <div className="config-card-icon"></div>
          <h3 className="config-card-title">Parameters</h3>
          <p className="config-card-description">
            Configure parameters and their values
          </p>
          <button className="config-card-button">Manage →</button>
        </div>
      </div>
    </div>
  );
}

export default AccessoriesConfiguration;
