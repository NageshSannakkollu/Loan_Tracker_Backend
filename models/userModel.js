const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:"user"
    }
},{timestamps:true})

const UserModel = mongoose.models.User || mongoose.model("User",userSchema) 
module.exports = UserModel;
