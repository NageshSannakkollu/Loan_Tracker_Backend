const { default: mongoose } = require("mongoose");

const loanSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    itemDescription: {
        type:String,
        required:true
    },
    loanAmount:{
        type:Number,
        required:true
    },
    interestPercentage:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    issueDate:{
        type:Date,
        required:true
    },
    frequency:{
        type:String,
        enum:['weekly','monthly'],
        required:true
    },
    termMonths:{
        type:Number,
        required:true
    },
    amountPaid:{
        type:Number,
        required:true,
        default:0
    },
    totalAmount:{
        type:Number,
        required:true
    },
    amountToBePerMonthOrWeek:{
        type:Number,
        required:true,
        default:0
    },
    dueDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['pending','paid','overDue'],
        default:"pending"
    }
    
},{timestamps:true})


const LoanModel = mongoose.models.Loan || mongoose.model("Loan",loanSchema) 
module.exports = LoanModel;