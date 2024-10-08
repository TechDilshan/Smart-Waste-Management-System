const express = require('express');
const { registerDustbin } = require('../controllers/dustbinController');

const router = express.Router();

// POST route for registering dustbin
router.post('/register', registerDustbin);

module.exports = router;
