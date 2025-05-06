const { default: mongoose } = require("mongoose");

const customerSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    trustScore:{
        type:Number,
        min:0,
        max:10,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        match:/^[0-9]{10}$/
        },
    address:{
            type:String
        },

},{timestamps:true})

const CustomerModel = mongoose.models.Customer||mongoose.model('Customer',customerSchema); 
module.exports = CustomerModel;