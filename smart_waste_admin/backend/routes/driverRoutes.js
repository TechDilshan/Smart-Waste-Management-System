const express = require('express');
const { registerDriver, getDriverDetails } = require('../controllers/driverController');

const router = express.Router();

// POST route for registering dustbin
router.post('/registerDriver', registerDriver);
router.get('/getDriverDetails', getDriverDetails);

module.exports = router;
