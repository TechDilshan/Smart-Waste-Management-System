import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation in react-router-dom v6
import Modal from 'react-modal'; // For the modal
import Sidebar from '../Component/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Import leaflet components
import L from 'leaflet'; // Import leaflet for handling custom marker

// Ensure Leaflet CSS is imported
import 'leaflet/dist/leaflet.css';

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
                    <p><strong>Location:</strong> {order.location ? `${order.location.latitude}, ${order.location.longitude}` : 'No location available'}</p>
                    <p><strong>Recycle Waste %:</strong> {order.recycleWastePercentage}</p>
                    <p><strong>Organic Waste %:</strong> {order.organicWastePercentage}</p>
                    <p><strong>General Waste %:</strong> {order.generalWastePercentage}</p>

                    <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                    <button style={styles.primaryButton} onClick={() => openSelectDriverModal(order)}>Select Driver</button>

                    {/* Display Map for Location */}
                    {order.location && !isModalOpen ? (
                      <MapContainer
                        center={[order.location.latitude, order.location.longitude]}
                        zoom={13}
                        style={{ width: '100%', height: '300px', borderRadius: '10px', marginTop: '20px' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Custom Red Marker */}
                        <Marker
                          position={[order.location.latitude, order.location.longitude]}
                          icon={L.icon({
                            iconUrl: 'https://static.vecteezy.com/system/resources/thumbnails/014/110/938/small_2x/red-pin-for-pointing-the-destination-on-the-map-3d-illustration-png.png', // Red marker URL
                            iconSize: [25, 41], // Size of the icon
                            iconAnchor: [12, 41], // Anchor point (middle of the bottom)
                            popupAnchor: [1, -34], // Position of the popup relative to the icon
                          })}
                        >
                          <Popup>{order.name} is located here.</Popup>
                        </Marker>
                      </MapContainer>
                    ) : (
                      <p>Location not available on map</p>
                    )}
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
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          ariaHideApp={false}
          style={styles.modalStyles}
        >
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
          <div style={styles.modalButtonContainer}>
            <button style={styles.primaryButton} onClick={handleSelectDriver} disabled={!selectedDriver}>
              Confirm Selection
            </button>
            <button style={styles.secondaryButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
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
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    marginLeft: '10px',
  },
  modalStyles: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '500px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    },
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
};

export default CustomerManagement;
