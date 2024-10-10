import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import Sidebar from './Sidebar';

const RegisterDustbin = () => {
  const [dustbinData, setDustbinData] = useState({ location: '', capacity: '', areaCode: '' });
  const [qrValue, setQrValue] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDustbinData({ ...dustbinData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the backend
      const response = await fetch('http://localhost:3001/api/dustbins/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dustbinData),
      });

      const data = await response.json();

      if (response.ok) {
        setQrValue(data.id); // Generate QR code based on returned ID from backend
      } else {
        console.error('Error: ', data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div style={{ display: 'flex' }}>
    {/* Sidebar */}
    <Sidebar />
      <h1>Register Smart Dustbin</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="email" onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="location" onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="name" onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="phone" onChange={handleInputChange} required />
        <input type="text" name="NIC" placeholder="NIC" onChange={handleInputChange} required />
        <input type="text" name="password" placeholder="password" onChange={handleInputChange} required />
        <button type="submit">Submit</button>
      </form>

      {qrValue && (
        <div>
          <h2>QR Code for Dustbin</h2>
          <QRCode value={qrValue} />
        </div>
      )}
    </div>
  );
};

export default RegisterDustbin;
