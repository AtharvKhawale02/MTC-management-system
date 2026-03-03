import React, { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError("All fields are required");
      return;
    }

    try {
      // Send login request to backend
      const res = await axios.post("/auth/login", {
        email: emailOrUsername,
        password,
      });

      // STORE TOKEN: Save token in browser so user stays logged in
      localStorage.setItem('token', res.data.token);
      
      // STORE USER INFO: Save user data
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // STORE ROLE: Save role separately for easy access
      localStorage.setItem('role', res.data.user.role.toLowerCase());

      // Redirect all users to dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login to MTC System</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginTop: "0",
    marginBottom: "30px",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "10px",
    transition: "opacity 0.2s ease",
  },
  error: {
    color: "#dc3545",
    backgroundColor: "#f8d7da",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    border: "1px solid #f5c6cb",
  },
};

export default Login;