import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, } from 'recharts';
import Sidebar from '../Component/Sidebar';

const WeightGraph = () => {
    // Static data for testing
    const weightData = [
        { date: '2024-10-01', weight: 20 },
        { date: '2024-10-02', weight: 22 },
        { date: '2024-10-03', weight: 18 },
        { date: '2024-10-04', weight: 25 },
        { date: '2024-10-05', weight: 23 },
        { date: '2024-10-06', weight: 19 },
        { date: '2024-10-07', weight: 21 },
    ];

    const wasteData = [
        { name: 'Organic', value: 40 },
        { name: 'Plastic', value: 25 },
        { name: 'Paper', value: 15 },
        { name: 'Glass', value: 10 },
        { name: 'Metal', value: 10 },
    ];

    // const [weightData, setWeightData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA3377'];


    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar />

            <div style={{ padding: '20px', flexGrow: 1 }}>
                <h1>Dashboard</h1>

                {/* Search Bar */}
                <div style={{ marginBottom: '20px', width: '90%' }}>
                    <input
                        type="text"
                        placeholder="Search by location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={styles.outerBox1}>
                    <div style={styles.box1}>
                        <h2>Driver Status</h2>
                        <p>Total Drivers: </p>
                        <p>Allocated Drivers: </p>
                        <p>Unllocated Drivers: </p>
                    </div>

                    <div style={styles.box1}>
                        <h2>Bin Status</h2>
                        <p>Total Bins: </p>
                    </div>

                    <div style={styles.box1}>
                        <h2>Truck Status</h2>
                        <p>Total Trucks: </p>
                        <p>Allocated Trucks: </p>
                        <p>Unllocated Trucks: </p>
                    </div>
                </div><br></br>

                <div style={styles.outerBox2}>
                    {/* Waste weight Box */}
                    <div style={styles.box2}>
                        <h2>Waste Weight</h2>
                        <p>Weight of the waste for last week</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Waste weight Box */}
                    <div style={styles.box2}>
                        <h2>Waste Weight</h2>
                        <p>Weight of the waste for last week</p>
                        <ResponsiveContainer width="100%" height={200} display="inline">
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.outerBox2}>
                    {/* Waste category Box */}
                    <div style={styles.box2}>
                        <h2>Waste Category</h2>
                        <p>Categories of waste per day</p>
                        <ResponsiveContainer width="100%" height={580}>
                            <PieChart>
                                <Pie
                                    data={wasteData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {wasteData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    box1: {
        padding: '20px',
        margin: '10px',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        textAlign: 'center',
        width: '30%',
        display: 'inline-block',
    },
    outerBox1: {
        transition: 'transform 0.3s ease-in-out',
        textAlign: 'center',
        width: '100%',
        display: 'flex',
    },
    box2: {
        padding: '20px',
        margin: '10px',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        // cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out',
        textAlign: 'center',
        width: '100%',
        display: 'inline-block',
    },
    outerBox2: {
        padding: '20px',
        margin: '10px',
        transition: 'transform 0.3s ease-in-out',
        textAlign: 'center',
        width: '40%',
        display: 'inline-block',
    }
};

export default WeightGraph;
