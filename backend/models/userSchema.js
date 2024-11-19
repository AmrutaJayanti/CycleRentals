const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll_num: {
        type: String,
        required: true,
        unique: true 
    },
    phone_num: {
        type: String,
        required: true,
        unique: true  
    },
    role: {
        type: String,
        enum: ['customer', 'admin'], 
        required: true
    },
    password: {
        type: String, 
        required: true  // Add password for authentication
    }
}, {timestamps: true  }    // Automatically adds createdAt and updatedAt fields
);
module.exports = mongoose.model('User', UserSchema);