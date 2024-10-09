// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', height: '100vh', background: '#2c3e50', color: '#fff', padding: '20px' }}>
      <h2>BinWatch</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/MainDashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        </li>
        <li>
          <Link to="/CustomerManagement" style={{ color: '#fff', textDecoration: 'none' }}>Bins</Link>
        </li>
        <li>
          <Link to="/truck" style={{ color: '#fff', textDecoration: 'none' }}>Truck</Link>
        </li>
        <li>
          <Link to="/driver" style={{ color: '#fff', textDecoration: 'none' }}>Driver</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
