const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        match: [/^\d{10}$/, 'Contact number must be exactly 10 digits']
    },
    role: {
        type: String,
        required: [true, 'Account type is required'],
        enum: ['Donor', 'NGO', 'Volunteer', 'Admin'], // or whatever your valid types are
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        maxlength: [300, 'Address can be at most 300 characters'],
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
