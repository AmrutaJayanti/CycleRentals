const mongoose = require("mongoose");
const cyclerentalSchema = new mongoose.Schema({
    user_name:{
        type : String,
        required : true
    },

    roll_no :{
        type : String,
        required:true
    },

    cycle_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cycle',
        required : true,
    },

    destination : {
        type : String,
        required : true,
    },

    time : {
        type : String, 
        required : true,
    }

})

module.exports = mongoose.model("Rental",cyclerentalSchema);