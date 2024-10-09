// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getOrderDetails } = require('../controllers/orderController');

// Route to get user details by email
router.get('/get-order-details', getOrderDetails);

module.exports = router;