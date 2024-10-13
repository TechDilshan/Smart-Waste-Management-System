import React, { useState, useEffect } from 'react';
import Sidebar from '../Component/Sidebar';
import Modal from 'react-modal';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerManagement = () => {
  const [email, setEmail] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch drivers list
  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dustbins/getAllDriverDetails');
      const data = await response.json();
      if (response.ok) {
        setDrivers(data.drivers);
      } else {
        setError('Unable to fetch drivers');
      }
    } catch (err) {
      setError('Error fetching drivers');
    }
  };

  const handleSearch = async () => {
    setUserDetails(null);
    setOrderDetails(null);
    setError('');

    try {
      const userResponse = await fetch(`http://localhost:3001/api/dustbins/get-user-details?email=${email}`);
      const userData = await userResponse.json();

      if (userResponse.ok) {
        setUserDetails(userData.user);
      } else {
        setError(userData.message || 'User not found');
      }

      const orderResponse = await fetch(`http://localhost:3001/api/dustbins/get-order-details?email=${email}`);
      const orderData = await orderResponse.json();

      if (orderResponse.ok) {
        setOrderDetails(orderData.order);
      } else {
        setError(orderData.message || 'Order not found');
      }
    } catch (err) {
      setError('Error fetching data');
    }
  };

  const handleSelectDriver = async () => {
    const currentDate = new Date().toISOString();
    const selectedOrder = {
      customerEmail: email,
      driverEmail: selectedDriver,
      orderDetails,
      date: currentDate
    };

    console.log(selectedOrder);

    try {
      const response = await fetch('http://localhost:3001/api/dustbins/set-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedOrder)
      });

      if (response.ok) {
        alert('Driver selected successfully!');
        setIsModalOpen(false);
      } else {
        setError('Failed to assign driver');
      }
    } catch (err) {
      setError('Error saving selected order');
    }
  };

  // Function to format Firestore timestamp to a readable date
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  const createPieData = (filledPercentage) => ({
    labels: ['Filled', 'Empty'],
    datasets: [
      {
        label: 'Waste',
        data: [filledPercentage, 100 - filledPercentage],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

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
          <div style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0'
          }}>
            <h2 style={{ gridColumn: 'span 3' }}>User Details</h2>
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
          <div style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0'
          }}>
            <h2>Order Details</h2>
            <p><strong>Location:</strong> Latitude {orderDetails.location.latitude}, Longitude {orderDetails.location.longitude}</p>
            <p><strong>Name:</strong> {orderDetails.name}</p>
            <p><strong>Timestamp:</strong> {formatTimestamp(orderDetails.timestamp)}</p>
          </div>
        )}

        {/* Display Waste Details in Separate Boxes */}
        {orderDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0'
            }}>
              <h3>Recycle Waste</h3>
              <Pie data={createPieData(orderDetails.recycleWastePercentage)} />
            </div>
            <div style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0'
            }}>
              <h3>Organic Waste</h3>
              <Pie data={createPieData(orderDetails.organicWastePercentage)} />
            </div>
            <div style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0'
            }}>
              <h3>General Waste</h3>
              <Pie data={createPieData(orderDetails.generalWastePercentage)} />
            </div>
          </div>
        )}

        {/* Select Driver Button */}
        {orderDetails && (
          <button onClick={() => setIsModalOpen(true)} style={{ marginTop: '10px' }}>
            Select Driver
          </button>
        )}

        {/* Modal for Driver Selection */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} ariaHideApp={false}>
            <h2>Select a Driver</h2>
            {drivers.length > 0 ? (
              <ul>
                {drivers.map((driver) => (
                  <li key={driver.email}>
                    <label>
                      <input
                        type="radio"
                        name="driver"
                        value={driver.email}
                        onChange={() => setSelectedDriver(driver.email)}
                        checked={selectedDriver === driver.email}
                      />
                      {driver.name} ({driver.email})
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No drivers available</p>
            )}
            <button onClick={handleSelectDriver} disabled={!selectedDriver}>
              Confirm Selection
            </button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
