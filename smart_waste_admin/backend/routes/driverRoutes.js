const express = require('express');
const { registerDriver, getDriverDetails, getAllDriverDetails } = require('../controllers/driverController');

const router = express.Router();

// POST route for registering dustbin
router.post('/registerDriver', registerDriver);
router.get('/getDriverDetails', getDriverDetails);
router.get('/getAllDriverDetails', getAllDriverDetails);

module.exports = router;
