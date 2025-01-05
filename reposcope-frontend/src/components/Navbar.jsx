import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
    }}
  >
    <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
      RepoScope
    </Link>
    <div>
      <Link to="/history" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>
        History
      </Link>
      <Link to="/code-suggestions" style={{ color: "white", textDecoration: "none" }}>
        Code Suggestions
      </Link>
    </div>
  </nav>
);

export default Navbar;
