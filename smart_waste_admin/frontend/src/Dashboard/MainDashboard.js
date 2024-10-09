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

  // Function to open the modal for selecting a driver
  const openSelectDriverModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to handle the driver selection
  const handleSelectDriver = async () => {
    if (!selectedDriver) {
      alert('Please select a driver.');
      return;
    }

    const orderUpdate = {
      customerEmail: selectedOrder.email,
      driverEmail: selectedDriver,
      orderDetails: selectedOrder,
      date: Date(),
    };


    console.log(orderUpdate);
    try {
      const response = await fetch('http://localhost:3001/api/dustbins/set-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderUpdate),
      });

      if (response.ok) {
        alert('Driver assigned successfully!');
        setIsModalOpen(false);
        setSelectedOrder(null);
        setSelectedDriver(null);
        // Optionally refetch orders after assigning driver
      } else {
        console.error('Failed to assign driver');
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
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

        {/* Orders Grid Section */}
        <div style={{ marginTop: '20px' }}>
          <h2>Customer Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <div style={styles.gridContainer}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} style={styles.orderCard}>
                    <h3>Customer Name: {order.name}</h3>
                    <p><strong>Customer Email:</strong> {order.email}</p>
                    <p><strong>Location:</strong> {order.location}</p>
                    <p><strong>Recycle Waste %:</strong> {order.recycleWastePercentage}</p>
                    <p><strong>Organic Waste %:</strong> {order.organicWastePercentage}</p>
                    <p><strong>General Waste %:</strong> {order.generalWastePercentage}</p>

                    <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                    <button onClick={() => openSelectDriverModal(order)}>Select Driver</button>
                  </div>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          )}
        </div>
      </div>

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
