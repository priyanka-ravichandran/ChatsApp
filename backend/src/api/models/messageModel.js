const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        required: true,
        enum: ['text', 'image']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
