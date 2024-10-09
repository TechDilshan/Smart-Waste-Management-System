// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getOrderDetails, getAllOrderDetails } = require('../controllers/orderController');

// Route to get user details by email
router.get('/get-order-details', getOrderDetails);
router.get('/get-orders', getAllOrderDetails);

module.exports = router;