const Message = require('../models/messageModel');
//const User = require('../models/userModel');

const messageController = {
    // Send a new message
    sendMessage: async (req, res) => {
        try {
            const { toUser, message } = req.body;
            const fromUser  = req.user.id;
            const newMessage = new Message({ fromUser , toUser, message });
        
            await newMessage.save();

            res.status(201).json({ message: 'Message sent successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Retrieve message history between two users
    getMessageHistory: async (req, res) => {
        try {
            const { toUser } = req.query;
            const loggedInUserId = req.user.id;
            const messages = await Message.find({
                $or: [
                    { fromUser: loggedInUserId, toUser: toUser },
                    { fromUser: toUser, toUser: loggedInUserId }
                ]
            }).sort({ timestamp: 1 });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = messageController;
