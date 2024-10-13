import React, { useState } from 'react';
import Sidebar from '../Component/Sidebar';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const CustomerManagement = () => {
  const [email, setEmail] = useState('');
  const [driverDetails, setDriverDetails] = useState(null);
  const [error, setError] = useState('');

  // Static data for the charts
  const attendancePercentage = 75;
  const satisfactionPercentage = 80;
  const binsCollectedLastWeek = [5, 8, 6, 7, 9, 4, 10];

  const handleSearch = async () => {
    setDriverDetails(null);
    setError('');

    try {
      const driverResponse = await fetch(`http://localhost:3001/api/dustbins/getDriverDetails?email=${email}`);
      const driverData = await driverResponse.json();

      if (driverResponse.ok) {
        setDriverDetails(driverData.driver);
      } else {
        setError(driverData.message || 'Driver not found');
      }
    } catch (err) {
      setError('Error fetching data');
    }
  };

  const createPieData = (label, value) => ({
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  });

  const createLineData = (collectedData) => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bins Collected',
        data: collectedData,
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  });

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.content}>
        <h1>Driver Management</h1>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            style={styles.form}
          />
          <button onClick={handleSearch} style={styles.button}>
            Search
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {driverDetails && (
          <div style={styles.detailsWrapper}>
            {/* Driver Details Box */}
            <div style={styles.detailsBox}>
              <h2>Driver Details</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p><strong>Email:</strong> {driverDetails.email}</p>
                  <p><strong>Name:</strong> {driverDetails.name}</p>
                  <p><strong>Phone:</strong> {driverDetails.phone}</p>
                </div>
                <div>
                  <p><strong>Location:</strong> {driverDetails.location}</p>
                  <p><strong>NIC:</strong> {driverDetails.NIC}</p>
                  <p><strong>Work today:</strong> {driverDetails.workToday ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Driver Image Box */}
            <div style={styles.driverImageBox}>
              <img
                src={driverDetails.imageUrl || 'https://via.placeholder.com/150'}
                alt="Driver"
                style={{ maxWidth: '100%', borderRadius: '5px' }}
              />
            </div>
          </div>
        )}

        {driverDetails && (
          <div style={styles.chartsWrapper}>
            <div style={styles.pieChartColumn}>
              <div style={styles.chartBox}>
                <h3>Attendance</h3>
                <Pie data={createPieData('Present', attendancePercentage)} />
              </div>

              {/* <div style={styles.chartBox}>
                <h3>Customer Satisfaction</h3>
                <Pie data={createPieData('Satisfied', satisfactionPercentage)} />
              </div> */}
            </div>

            <div style={styles.lineChartBox}>
              <h3>Bins Collected (Last Week)</h3>
              <Line data={createLineData(binsCollectedLastWeek)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    padding: '20px',
    flexGrow: 1,
  },
  form: {
    padding: '10px',
    width: '300px',
    marginRight: '10px',
  },
  button: {
    padding: '10px',
  },
  error: {
    color: 'red',
  },
  detailsWrapper: {
    marginTop: '20px',
    display: 'flex',
    gap: '20px',
  },
  detailsBox: {
    flex: '0 0 60%',
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '60%',
  },
  driverImageBox: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '2px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chartsWrapper: {
    marginTop: '20px',
    display: 'flex',
    gap: '20px',
  },
  pieChartColumn: {
    flex: '0 0 40%', // 40% of the screen width for the pie chart column
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '40%', // Set width to 40% of the screen
  },
  lineChartBox: {
    flex: '1', // Take the remaining width for the line chart
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chartBox: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default CustomerManagement;
