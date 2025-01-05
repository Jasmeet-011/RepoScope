import React, { useState } from "react";
import axios from "axios";

const CodeSuggestionsPage = () => {
  const [fileContent, setFileContent] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSuggestions = async () => {
    if (!fileContent.trim() || !repoUrl.trim()) {
      setError("Please enter both repository URL and code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/code-suggestions`,
        { fileContent, repoUrl }
      );
      setSuggestions(res.data.suggestions);
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Code Suggestions</h1>
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub Repository URL"
        style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
      />
      <textarea
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        placeholder="Paste your code here..."
        style={{ width: "80%", height: "150px", padding: "10px", marginBottom: "10px" }}
      ></textarea>
      <br />
      <button
        onClick={handleGenerateSuggestions}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Get Suggestions"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {suggestions && (
        <div
          style={{
            textAlign: "left",
            marginTop: "20px",
            padding: "10px",
            background: "#f9f9f9",
            borderRadius: "5px",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <h3>Suggestions:</h3>
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default CodeSuggestionsPage;
