import React, { useState } from 'react';
import Sidebar from '../Component/Sidebar';

const RegisterDriver = () => {
  const [dustbinData, setDustbinData] = useState({ location: '', capacity: '', areaCode: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDustbinData({ ...dustbinData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the backend
      const response = await fetch('http://localhost:3001/api/dustbins/registerDriver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dustbinData),
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      <div style={{ padding: '20px', flexGrow: 1 }}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Register Driver</h1>
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
};

export default RegisterDriver;
