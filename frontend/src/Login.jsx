import React, { useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    setMessage("Logging in...");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful!");
        onLoginSuccess();
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Login</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <p>{message}</p>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 400,
    margin: "60px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  input: {
    width: "90%",
    margin: "10px auto",
    padding: "12px",
    fontSize: 16,
    borderRadius: "8px",
    border: "1px solid #ccc",
    display: "block"
  },
};

export default Login;
