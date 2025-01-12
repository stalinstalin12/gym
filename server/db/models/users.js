const mongoose = require('mongoose');
const user_type = require('./user_type');
const users = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    address:{
        type : String,
    },
    user_type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_types"
    } ,
    isBlocked: {
        type: Boolean,
        default: false // False means not blocked, True means blocked
    },
},
{
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
}
);

module.exports = mongoose.model("users", users);