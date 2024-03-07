const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController'); // Adjust the path as necessary
const authenticate = require('../middleware/authenticate'); // Your authentication middleware

// Route to send a new message
router.post('/send', authenticate, messageController.sendMessage);

// Route to retrieve message history
router.get('/history', authenticate, messageController.getMessageHistory);

module.exports = router;
