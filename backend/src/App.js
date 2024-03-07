const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

// Database connection
const connectDB = require('./config/db');
connectDB();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file)
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ imageUrl: `/uploads/${file.filename}` });
});

// Import routes
const authRoutes = require('./api/routes/authRoutes');
const contactsRoute = require('./api/routes/contactsRoutes');
const messageRoutes = require('./api/routes/messageRoutes');
const Message = require('./api/models/messageModel');

// Routes
app.use('/auth', authRoutes);
app.use('/contacts', contactsRoute);
app.use('/messages', messageRoutes);
app.use('/uploads', express.static('uploads'));
// Socket.io for real-time communication
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (data) => {
        try {
            const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
            const userId = decoded.id;
            // Save message to database or handle it accordingly
            const newMessage = new Message({
                fromUser: userId,
                toUser: data.toUser,
                message: data.message,
                messageType: data.messageType
            });

            await newMessage.save();

            // Emit message to all connected clients
            io.emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Starting the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
