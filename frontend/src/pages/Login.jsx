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
<<<<<<< HEAD
=======
      // Send login request to backend
>>>>>>> b316133 (Connect backend auth and update frontend integration)
      const res = await axios.post("/auth/login", {
        email: emailOrUsername,
        password,
      });

<<<<<<< HEAD
      const role = res.data.role;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

=======
      // STORE TOKEN: Save token in browser so user stays logged in
      localStorage.setItem('token', res.data.token);
      
      // STORE USER INFO: Save user data
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Get user's role from response
      const role = res.data.user.role.toLowerCase();

      // Redirect based on role
>>>>>>> b316133 (Connect backend auth and update frontend integration)
      if (role === "admin") navigate("/admin");
      else if (role === "sales") navigate("/sales");
      else navigate("/quality");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            style={styles.input}
          />
        </div>

        <div>
          <label>Password:</label>
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
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0 16px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "#dc3545",
    backgroundColor: "#f8d7da",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default Login;