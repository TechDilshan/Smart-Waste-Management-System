const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const dustbinRoutes = require('./routes/dustbinRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // To parse incoming JSON requests

// Routes
app.use('/api/dustbins', dustbinRoutes); // All dustbin routes

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
