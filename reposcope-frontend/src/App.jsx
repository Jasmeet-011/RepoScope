import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import CodeSuggestionsPage from "./pages/CodeSuggestionsPage";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/code-suggestions" element={<CodeSuggestionsPage />} />
    </Routes>
  </Router>
);

export default App;
