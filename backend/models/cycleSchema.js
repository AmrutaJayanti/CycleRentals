const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
    cycleModel: {
        type: String,
        required: true,
    },
    cph: {  // Cost per hour
        type: Number,
        required: true
    },
    l_user: {  // Last user (optional)
        type: String
    },
    curr_avail: {  // Current availability
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        required: true
    },
    image : {
        type : String,
        required:true
    },
    issues: {
        type: [String]  
    }
}, {
    timestamps: true  // Add createdAt and updatedAt fields
});

module.exports = mongoose.model('Cycle', cycleSchema);