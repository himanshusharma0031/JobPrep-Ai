const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        unique : [true,"username already exist"],
        required : true
    },
    email:{
        type : String,
        unique : [true,"Account already exist"],
        required : true
    },
    password:{
        type : String,
        required : true
    }
});
const userModal = mongoose.model("users",UserSchema);
module.exports = userModal;