import React from "react";

const RepositoryDetails = ({ repoData }) => (
  <div
    style={{
      textAlign: "left",
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "#f9f9f9",
      maxWidth: "600px",
      margin: "auto",
    }}
  >
    <h2>Repository Details</h2>
    <p>
      <strong>Stars:</strong> {repoData.stars}
    </p>
    <p>
      <strong>Forks:</strong> {repoData.forks}
    </p>
    <p>
      <strong>Open Issues:</strong> {repoData.openIssues}
    </p>
    <p>
      <strong>Commits:</strong> {repoData.commits}
    </p>
    <p>
      <strong>Health Score:</strong> {repoData.healthScore}%
    </p>
    <p>
      <strong>Languages:</strong> {repoData.languages.join(", ")}
    </p>
  </div>
);

export default RepositoryDetails;
