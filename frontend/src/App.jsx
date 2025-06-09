import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Chatbot from "./Chatbot";
import "./App.css"

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <button
          style={{ float: "right", margin: 20 }}
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
        <Chatbot /> 
      </div>
    );
  }
  return (
    <div>
      {showLogin ? (
        <>
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          <p style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <button onClick={() => setShowLogin(false)}>Register</button>
          </p>
        </>
      ) : (
        <>
          <Register />
          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <button onClick={() => setShowLogin(true)}>Login</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
