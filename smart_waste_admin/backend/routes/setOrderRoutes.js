const express = require('express');
const router = express.Router();
const orderController = require('../controllers/setOrderController');

// Route to handle saving selected order
router.post('/set-order', orderController.saveSelectedOrder);

module.exports = router;
