import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // To determine the current route

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>BinWatch</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link
            to="/MainDashboard"
            style={{
              ...styles.link,
              ...(location.pathname === '/MainDashboard' ? styles.activeLink : {}),
            }}
          >
            Dashboard
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link
            to="/Orders"
            style={{
              ...styles.link,
              ...(location.pathname === '/Orders' ? styles.activeLink : {}),
            }}
          >
            Orders
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link
            to="/CustomerManagement"
            style={{
              ...styles.link,
              ...(location.pathname === '/CustomerManagement' ? styles.activeLink : {}),
            }}
          >
            Bins
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link
            to="/truck"
            style={{
              ...styles.link,
              ...(location.pathname === '/truck' ? styles.activeLink : {}),
            }}
          >
            Truck
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link
            to="/DriverManagement"
            style={{
              ...styles.link,
              ...(location.pathname === '/DriverManagement' ? styles.activeLink : {}),
            }}
          >
            Driver
          </Link>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 15px',
    display: 'block',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  activeLink: {
    backgroundColor: '#7dde8a', // Active link background color
  },
};

export default Sidebar;
