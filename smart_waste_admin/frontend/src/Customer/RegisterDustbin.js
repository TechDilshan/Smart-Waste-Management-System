import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import Sidebar from '../Component/Sidebar';

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

  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      <div style={{ padding: '20px', flexGrow: 1 }}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Register Smart Dustbin</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter Location"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>NIC</label>
            <input
              type="text"
              name="NIC"
              placeholder="Enter NIC"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Submit</button>
          </form>

          {qrValue && (
            <div style={styles.qrContainer} ref={qrRef}>
              <h2 style={styles.qrHeading}>QR Code for Dustbin</h2>
              <div style={styles.qrWrapper}>
                <QRCode value={qrValue} />
              </div>
              <button onClick={downloadQRCode} style={styles.downloadButton}>
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: '40px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '750px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    textAlign: 'left',
    // marginBottom: '1px', // Decreased gap between label and input field
    fontSize: '18px',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  qrContainer: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrWrapper: {
    marginBottom: '15px',
  },
  qrHeading: {
    fontSize: '18px',
    marginBottom: '15px',
  },
  downloadButton: {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default RegisterDustbin;
