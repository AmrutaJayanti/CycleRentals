const mongoose = require("mongoose");
const stationSchema = new mongoose.Schema({
    name: {  // Name of the station
        type: String,
        required: true,
        unique: true  
    },
    nAvailable: {  // Number of cycles available
        type: Number,
        required: true
    },
    cyclesAvailable: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Cycle documents
        ref: 'Cycle'
    }]
}, {
    timestamps: true  // Track station creation and updates
});

module.exports = mongoose.model('Station', stationSchema);