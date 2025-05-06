const { default: mongoose } = require("mongoose");

const RepaymentSchema = new mongoose.Schema({
    loanId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Loan',
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:1 
    },
    paidAt:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

const RepaymentModel = mongoose.models.Repayment || mongoose.model('Repayment',RepaymentSchema)

module.exports = RepaymentModel;