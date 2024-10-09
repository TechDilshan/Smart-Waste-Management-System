// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/customerController');

// Route to get user details by email
router.get('/get-user-details', getUserDetails);

module.exports = router;