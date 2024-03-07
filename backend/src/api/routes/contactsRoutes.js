const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const authenticate = require('../middleware/authenticate');

router.get('/getContacts', authenticate, contactsController.getContacts);
router.post('/addContact', authenticate, contactsController.addContact);
router.delete('/deleteContact', authenticate, contactsController.deleteContact);

module.exports = router;
