const mongoose = require('mongoose');

const contactsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Contacts = mongoose.model('Contacts', contactsSchema);

module.exports = Contacts;