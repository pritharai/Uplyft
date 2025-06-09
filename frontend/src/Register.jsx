import React, { useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    setMessage("Registering...");
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! You can now login.");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Register</h2>
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
      <button onClick={register}>Register</button>
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


export default Register;
