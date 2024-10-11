import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation in react-router-dom v6
import Modal from 'react-modal'; // For the modal
import Sidebar from '../Customer/Sidebar';

const CustomerManagement = () => {
  const navigate = useNavigate();  // Hook for navigation
  const [orders, setOrders] = useState([]);  // State for storing orders
  const [loading, setLoading] = useState(true);  // Loading state
  const [drivers, setDrivers] = useState([]);  // Drivers state
  const [selectedDriver, setSelectedDriver] = useState(null);  // Selected driver for modal
  const [selectedOrder, setSelectedOrder] = useState(null);  // Selected order for driver assignment
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal open/close state

  // Fetch customer orders from the API when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dustbins/get-orders');
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders); // Set the fetched orders
        } else {
          console.error('Failed to fetch orders', data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dustbins/getAllDriverDetails');
        const data = await response.json();

        if (response.ok) {
          setDrivers(data.drivers); // Set the fetched drivers
        } else {
          console.error('Failed to fetch drivers', data.message);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchOrders();
    fetchDrivers();
  }, []);

  // Function to navigate to the Create Dustbin page
  const handleCreateDustbin = () => {
    navigate('/RegisterDustbin');  // Route for the create dustbin page
  };

  // Function to navigate to the Create Driver page
  const handleCreateDriver = () => {
    navigate('/RegisterDriver');  // Route for the create driver page
  };

  // Function to navigate to the Create truck page
  const handleCreateTruck = () => {
    navigate('/RegisterTruck');  // Route for the create driver page
  };

  // Function to navigate to the Create truck page
  const viewTotalBin = () => {
    navigate('/BinDetails');  // Route for the create driver page
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Dashboard</h1>

        {/* Create Dustbin Box */}
        <div style={styles.box} onClick={handleCreateDustbin}>
          <h2>Add Dustbin</h2>
          <p>Create a new dustbin for the system</p>
        </div>

        {/* Create Driver Box */}
        <div style={styles.box} onClick={handleCreateDriver}>
          <h2>Add Driver</h2>
          <p>Create a new driver for the system</p>
        </div>

        {/* Create Truck Box */}
        <div style={styles.box} onClick={handleCreateTruck}>
          <h2>Add Truck</h2>
          <p>Create a new truck for the system</p>
        </div>   

        {/* View Overall Bin */}
        <div style={styles.box} onClick={viewTotalBin}>
          <h2>View Bin</h2>
          <p>View overall bin details</p>
        </div>        
      </div>
    </div>
  );
};

const styles = {
  box: {
    padding: '40px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    textAlign: 'center',
    width: '40%',
    display: 'inline-block',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    paddingTop: '20px',
  },
  orderCard: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
};

export default CustomerManagement;
