const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Signup handler
    async signup(req, res) {
        try {
            const { username, password } = req.body;
            // Check if the user already exists
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
           

            // Create a new user
            user = new User({ username, password });
            await user.save(); 
            

            res.status(201).json({
                message: 'User created successfully'
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Login handler
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalids credentials' });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Login successful',
                token,
            });
        } catch (error) {
            console.error("Error occurred: ", error);
            res.status(500).json({ message: 'Server error', error: error.message })
        }
    }
};

module.exports = authController;
