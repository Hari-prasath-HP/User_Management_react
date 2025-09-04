import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.css"; // CSS file

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome, {user.name}!</h1>
        <p className="home-subtitle">Glad to see you back.</p>

        <div className="home-actions">
          <Link to="/profile" className="home-btn">
            Go to Profile
          </Link>
          {/* Optional: Add more quick links or stats here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
