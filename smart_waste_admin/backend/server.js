const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const dustbinRoutes = require('./routes/dustbinRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // To parse incoming JSON requests

// Routes
app.use('/api/dustbins', dustbinRoutes,customerRoutes, orderRoutes); // All dustbin routes

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
