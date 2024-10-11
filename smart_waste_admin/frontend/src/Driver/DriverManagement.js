// components/CustomerManagement.js
import React, { useState } from 'react';
import Sidebar from '../Component/Sidebar';

const CustomerManagement = () => {
  const [email, setEmail] = useState('');
  const [driverDetails, setDriverDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setDriverDetails(null); // Reset the previous details before fetching new data
    setError(''); // Reset the error state before fetching new data

    try {
      const driverResponse = await fetch(`http://localhost:3001/api/dustbins/getDriverDetails?email=${email}`);
      const driverData = await driverResponse.json();

      if (driverResponse.ok) {
        setDriverDetails(driverData.driver); // Update user details if fetch was successful
      } else {
        setError(driverData.message || 'User not found');
      }
    } catch (err) {
      setError('Error fetching data');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Driver Management</h1>

        {/* Email Search Form */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            style={{ padding: '10px', width: '300px', marginRight: '10px' }}
          />
          <button onClick={handleSearch} style={{ padding: '10px' }}>
            Search
          </button>
        </div>

        {/* Display Error if exists */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display User Details */}
        {driverDetails && (
          <div style={{ marginTop: '20px' }}>
            <h2>User Details</h2>
            <p><strong>Email:</strong> {driverDetails.email}</p>
            <p><strong>Location:</strong> {driverDetails.location}</p>
            <p><strong>Name:</strong> {driverDetails.name}</p>
            <p><strong>Phone:</strong> {driverDetails.phone}</p>
            <p><strong>NIC:</strong> {driverDetails.NIC}</p>
            <p><strong>Work today:</strong> {driverDetails.payment ? 'Yes' : 'No'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerManagement;
