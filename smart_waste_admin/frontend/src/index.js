import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import RegisterDustbin from './Customer/RegisterDustbin';
import CustomerManagement from './Customer/CustomerManagement';
import MainDashboard from './Dashboard/MainDashboard';
import RegisterDriver from './Driver/RegisterDriver';
import DriverManagement from './Driver/DriverManagement';
import BinDetails from './Dashboard/BinDetails';
import OrderDetails from './Dashboard/OrderDetails'
import RegisterTruck from './Truck/RegisterTruck'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<App />} />
        <Route path='/RegisterDustbin' element={<RegisterDustbin />} />
        <Route path='/CustomerManagement' element={<CustomerManagement />} />
        <Route path='/MainDashboard' element={<MainDashboard />} />
        <Route path='/RegisterDriver' element={<RegisterDriver />} />
        <Route path='/DriverManagement' element={<DriverManagement />} />
        <Route path='/BinDetails' element={<BinDetails />} />
        <Route path='/Orders' element={<OrderDetails />} />
        <Route path='/RegisterTruck' element={<RegisterTruck />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
