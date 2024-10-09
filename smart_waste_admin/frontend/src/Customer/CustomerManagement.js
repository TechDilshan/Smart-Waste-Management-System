// components/CustomerManagement.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';

const CustomerManagement = () => {
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/dustbins/get-user-details?email=${email}`);
      const data = await response.json();

      if (response.ok) {
        setUserDetails(data.user);
        setError('');
      } else {
        setUserDetails(null);
        setError(data.message || 'User not found');
      }
    } catch (error) {
      setError('Error fetching user details');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Customer Management</h1>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            style={{ padding: '10px', width: '300px' }}
          />
          <button onClick={handleSearch} style={{ padding: '10px', marginLeft: '10px' }}>Search</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {userDetails && (
          <div style={{ marginTop: '20px' }}>
            <h2>User Details</h2>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Location:</strong> {userDetails.location}</p>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Phone:</strong> {userDetails.phone}</p>
            <p><strong>NIC:</strong> {userDetails.NIC}</p>
            <p><strong>Payment:</strong> {userDetails.payment ? 'Done' : 'Pending'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
