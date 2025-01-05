const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
require("dotenv").config();
const RepoHistory = require("../models/RepoHistory");

const router = express.Router();

// Initialize GoogleGenerativeAI if API key is available
let model;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
  console.error("GEMINI_API_KEY is not set in .env");
}

// Function to calculate repository health score
function calculateHealthScore(stats) {
  const { stars, forks, openIssues, commits } = stats;
  const weights = { stars: 0.4, forks: 0.3, openIssues: -0.2, commits: 0.3 };
  const maxValues = { stars: 1000, forks: 500, openIssues: 100, commits: 1000 };

  const normalizedStars = Math.min(stars / maxValues.stars, 1);
  const normalizedForks = Math.min(forks / maxValues.forks, 1);
  const normalizedOpenIssues = Math.min(openIssues / maxValues.openIssues, 1);
  const normalizedCommits = Math.min(commits / maxValues.commits, 1);

  const healthScore =
    weights.stars * normalizedStars +
    weights.forks * normalizedForks -
    weights.openIssues * normalizedOpenIssues +
    weights.commits * normalizedCommits;

  return Math.round(healthScore * 100);
}

// POST /api/repo-stats
router.post("/repo-stats", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Repository URL is required." });
  }

  try {
    const repoName = url.split("github.com/")[1];
    const response = await axios.get(
      `https://api.github.com/repos/${repoName}`,
      {
        headers: { Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}` },
      }
    );

    const { stargazers_count, forks_count, open_issues_count } = response.data;

    // Fetch languages used in the repo
    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${repoName}/languages`,
      {
        headers: { Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}` },
      }
    );
    const languages = Object.keys(languagesResponse.data);

    // Simulate fetching commits (replace with actual GitHub API call if needed)
    const commits = 200; // Example commit count

    const repoStats = {
      stars: stargazers_count,
      forks: forks_count,
      openIssues: open_issues_count,
      commits: commits,
      languages: languages,
    };

    // Calculate health score and add it to stats
    repoStats.healthScore = calculateHealthScore(repoStats);

    // Automatically save the history in the database
    const newHistory = new RepoHistory({
      url,
      stats: repoStats,
    });
    await newHistory.save();

    res.status(200).json({ stats: repoStats });
  } catch (error) {
    console.error("Error fetching repo stats:", error);
    res.status(500).json({ error: "Failed to fetch repo stats." });
  }
});

// POST /api/code-suggestions
router.post("/code-suggestions", async (req, res) => {
  const { fileContent, repoUrl } = req.body;

  if (!fileContent || !repoUrl) {
    return res
      .status(400)
      .json({ error: "File content and repository URL are required." });
  }

  try {
    // Fetch stats from the history if they are not provided
    let repoHistory = await RepoHistory.findOne({ url: repoUrl });

    if (!repoHistory) {
      return res.status(400).json({
        error:
          "Repository stats not found. Please analyze the repository first.",
      });
    }

    const prompt = `Provide code suggestions and improvements for the following code:\n\n${fileContent}`;
    const result = await model.generateContent(prompt);

    const suggestions =
      result?.response?.text?.() || "No suggestions provided.";

    // Update the existing history with suggestions
    repoHistory.suggestions = suggestions;
    await repoHistory.save();

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error generating code suggestions:", error);
    res.status(500).json({ error: "Failed to generate code suggestions." });
  }
});

// GET /api/history
router.get("/history", async (req, res) => {
  try {
    const history = await RepoHistory.find().sort({ date: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

module.exports = router;
