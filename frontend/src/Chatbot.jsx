import { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/chat", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    };

    fetchChatHistory();
  }, []);

  const saveMessage = async (sender, text) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/chat",
        { sender, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to save message", error);
    }
  };

  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg) return;

    const userMessageObj = { sender: "user", text: userMsg };
    setMessages(prev => [...prev, userMessageObj]);
    setInput("");
    await saveMessage("user", userMsg);

    const lowerInput = userMsg.toLowerCase();

    // Handle greetings
    if (["hi", "hello", "hey", "hola"].includes(lowerInput)) {
      const botText = "Hello! 👋 I'm your shopping assistant. Ask me about phones, laptops, accessories, etc.";
      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
      await saveMessage("bot", botText);
      return;
    }

    // Determine product category dynamically
    let category = null;
    if (lowerInput.includes("phone")) category = "phone";
    else if (lowerInput.includes("laptop")) category = "laptop";
    else if (lowerInput.includes("accessor")) category = "accessory";

    if (!category) {
      const botText = "Sorry, I didn't understand. Try asking for phones, laptops, or accessories.";
      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
      await saveMessage("bot", botText);
      return;
    }

    // Fetch products by category
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/products?category=${category}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const products = res.data;

      if (products.length === 0) {
        const botText = `Sorry, no ${category}s found.`;
        setMessages(prev => [...prev, { sender: "bot", text: botText }]);
        await saveMessage("bot", botText);
      } else {
        const botText = `Here are some ${category}s I found:`;
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: botText, products }
        ]);
        await saveMessage("bot", botText);
      }
    } catch (error) {
      const botText = "⚠️ Error contacting server. Please try again later.";
      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
      await saveMessage("bot", botText);
    }
  };

  return (
    <div className="chat-container">
      <h2>🛒 E-commerce Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender}>
            <p><strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}</p>

            {/* Show products if any */}
            {msg.products && msg.products.map(p => (
              <div key={p.id} className="product-card" style={{border: "1px solid #ddd", margin: "10px", padding: "10px", borderRadius: "8px", display: "flex", gap: "15px", alignItems: "center"}}>
                <img src={p.image_url} alt={p.name} width="100" height="100" style={{objectFit: "contain"}} />
                <div>
                  <p><b>Name:</b> {p.name}</p>
                  <p><b>Brand:</b> {p.brand}</p>
                  <p><b>Price:</b> ₹{p.price}</p>
                  {/* Assuming model is in description or name */}
                  {p.description && <p><b>Model:</b> {p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
