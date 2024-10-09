// components/CustomerManagement.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation in react-router-dom v6
import Sidebar from '../Customer/Sidebar';

const CustomerManagement = () => {
  const navigate = useNavigate();  // Hook for navigation

  // Function to navigate to the Create Dustbin page
  const handleCreateDustbin = () => {
    navigate('/RegisterDustbin');  // Route for the create dustbin page
  };

  // Function to navigate to the Create Driver page
  const handleCreateDriver = () => {
    navigate('/create-driver');  // Route for the create driver page
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Dashboard</h1>

        {/* Create Dustbin Box */}
        <div style={styles.box} onClick={handleCreateDustbin}>
          <h2>Create Dustbin</h2>
          <p>Create a new dustbin for the system</p>
        </div>

        {/* Create Driver Box */}
        <div style={styles.box} onClick={handleCreateDriver}>
          <h2>Create Driver</h2>
          <p>Create a new driver for the system</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  box: {
    padding: '20px',
    margin: '10px 0',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    textAlign: 'center',
    width: '250px',
  },
  boxHover: {
    transform: 'scale(1.05)',
  },
};

export default CustomerManagement;
