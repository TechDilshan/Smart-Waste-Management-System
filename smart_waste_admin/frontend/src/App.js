import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import backgroundImage from './background.jpg'; // Import your background image

function App() {
  return (
      <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="content-overlay">
          <h1>Welcome to Smart Waste Management</h1>
          <p>Efficient, Sustainable, Smart</p>
          <Link to="/MainDashboard" className="dashboard-button">
            Go to Dashboard
          </Link>
        </div>
      </div>
  );
}

export default App;
