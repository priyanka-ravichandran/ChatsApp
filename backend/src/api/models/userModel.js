const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
    // You can add more fields here if needed
}, {
    timestamps: true // Automatically create 'createdAt' and 'updatedAt' fields
});

// Hash the user's password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
