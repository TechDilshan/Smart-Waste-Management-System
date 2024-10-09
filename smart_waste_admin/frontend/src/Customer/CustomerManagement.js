// components/CustomerManagement.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';

const CustomerManagement = () => {
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setUserDetails(null); // Reset the previous details before fetching new data
    setOrderDetails(null);
    setError(''); // Reset the error state before fetching new data

    try {
      const userResponse = await fetch(`http://localhost:3001/api/dustbins/get-user-details?email=${email}`);
      const userData = await userResponse.json();

      if (userResponse.ok) {
        setUserDetails(userData.user); // Update user details if fetch was successful
      } else {
        setError(userData.message || 'User not found');
      }

      const orderResponse = await fetch(`http://localhost:3001/api/dustbins/get-order-details?email=${email}`);
      const orderData = await orderResponse.json();

      if (orderResponse.ok) {
        setOrderDetails(orderData.order); // Update order details if fetch was successful
      } else {
        setError(orderData.message || 'Order not found');
      }
    } catch (err) {
      setError('Error fetching data');
    }
  };

  // Function to format Firestore timestamp to a readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Format the date as a string
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Customer Management</h1>

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

        {/* Display Order Details */}
        {orderDetails && (
          <div style={{ marginTop: '20px' }}>
            <h2>Order Details</h2>
            <p><strong>Location:</strong> {orderDetails.location}</p>
            <p><strong>Name:</strong> {orderDetails.name}</p>
            <p><strong>Timestamp:</strong> {formatTimestamp(orderDetails.timestamp)}</p> {/* Fix here */}
            <p><strong>Recycle Waste %:</strong> {orderDetails.recycleWastePercentage}</p>
            <p><strong>Organic Waste %:</strong> {orderDetails.organicWastePercentage}</p>
            <p><strong>General Waste %:</strong> {orderDetails.generalWastePercentage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
