const DbConnection = require("../config/database");
const LoanModel = require("../models/loanModel");
const RepaymentModel = require("../models/repaymentModel");
const UserModel = require("../models/userModel");

const DbActiveConnection = async() => {
    await DbConnection()
}
DbActiveConnection()

const createRepayment = async(req,res) => {
    const {loanId,amount,paidAt}= req.body;
    const {email} = req;
    const checkUserEEmail = await UserModel.findOne({email:email})
        if(!checkUserEEmail){
            return res.status(400).send("Invalid User");
    }
    const loan = await LoanModel.findById({_id:loanId})
    if(!loan) return res.status(400).send("Invalid Loan Id");
    const repayment = await RepaymentModel.create({loanId,amount,paidAt})
    console.log("loan:",loan)

    //update loan amount 
    loan.amountPaid += amount;
    if(loan.amountPaid > loan.totalAmount) loan.amountPaid = loan.totalAmount;
    loan.status = loan.amountPaid >= loan.totalAmount ? 'paid':"pending"
    await loan.save();
    res.status(200).send({repayment,updatedLoan:loan})
}



module.exports = {createRepayment}