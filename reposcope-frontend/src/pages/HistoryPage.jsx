import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/history`);
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Analysis History</h1>
      {history.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {history.map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <p><strong>Repository URL:</strong> {item.url}</p>
              <p><strong>Stars:</strong> {item.stats.stars}</p>
              <p><strong>Forks:</strong> {item.stats.forks}</p>
              <p><strong>Health Score:</strong> {item.stats.healthScore}%</p>
              <p><strong>Suggestions:</strong></p>
              <ul>
                {item.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
              <p style={{ fontSize: "0.8rem", color: "#666" }}>
                Analyzed on: {new Date(item.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No analysis history available.</p>
      )}
    </div>
  );
};

export default HistoryPage;
