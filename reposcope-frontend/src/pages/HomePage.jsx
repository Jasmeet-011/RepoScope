import React, { useState } from "react";
import axios from "axios";
import RepositoryDetails from "../components/RepositoryDetails";

const HomePage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRepoDetails = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setRepoData(null);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/repo-stats`, {
        url: repoUrl,
      });

      setRepoData(res.data.stats);
    } catch (err) {
      setError("Failed to fetch repository details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Analyze Your GitHub Repository</h1>
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub Repository URL"
        style={{ padding: "10px", width: "300px", margin: "10px", borderRadius: "5px" }}
      />
      <button onClick={fetchRepoDetails} style={{ padding: "10px 20px" }} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {repoData && <RepositoryDetails repoData={repoData} />}
    </div>
  );
};

export default HomePage;
