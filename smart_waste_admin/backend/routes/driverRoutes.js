const express = require('express');
const { registerDriver } = require('../controllers/driverController');

const router = express.Router();

// POST route for registering dustbin
router.post('/registerDriver', registerDriver);

module.exports = router;
