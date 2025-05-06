const DbConnection = require("../config/database");
const CustomerModel = require("../models/customerModel");
const LoanModel = require("../models/loanModel");
const RepaymentModel = require("../models/repaymentModel");
const UserModel = require("../models/userModel");
const { isBefore } = require("date-fns");

const DbActiveConnection = async() => {
    await DbConnection()
}
DbActiveConnection()

const registerLoan = async(req,res) => {
    const loanDetails = req.body;
    let totalPayableAmount;
    let perMonthPayable;
    let loanStatus;
    if(loanDetails.frequency === 'monthly'){
        const interestAmount = (loanDetails.loanAmount*loanDetails.interestPercentage)/100 
        totalPayableAmount= (interestAmount*loanDetails.termMonths)+loanDetails.loanAmount;
        perMonthPayable = (totalPayableAmount/loanDetails.termMonths).toFixed(2);
    }else if(loanDetails.frequency === 'weekly'){
       const interestAmount = (loanDetails.loanAmount*loanDetails.interestPercentage)/100 
        totalPayableAmount= (interestAmount*loanDetails.termMonths)+loanDetails.loanAmount;
        perMonthPayable = (totalPayableAmount/((loanDetails.termMonths/12)*(52))).toFixed(2);
        perMonthPayable = perMonthPayable/4
    }
    console.log(totalPayableAmount,perMonthPayable)
    if(loanDetails.amountPaid >= totalPayableAmount) {
        loanStatus = 'closed';
    }
    else{
        loanStatus = 'pending';
    }

    const {email} = req;
    const checkUserEEmail = await UserModel.findOne({email:email})
    if(!checkUserEEmail){
        return res.status(400).send("Invalid User");
    }
    const checkCustomerId = await CustomerModel.findOne({_id:loanDetails.customerId})
    if(!checkCustomerId){
        return res.status(400).send("Invalid Customer Id");
    }
    await LoanModel.create({...loanDetails,userId:checkUserEEmail._id,totalAmount:totalPayableAmount,amountToBePerMonthOrWeek:perMonthPayable,status:loanStatus});
    res.status(201).send({message:"New Loan Created",success:true})
    
}

const viewAllLoans = async(req,res) =>{
    const {email} = req;
    const checkUserEEmail = await UserModel.findOne({email:email})
    if(!checkUserEEmail){
        return res.status(400).send("Invalid User");
    }
    const allLoansQuery = await LoanModel.find({userId:checkUserEEmail._id})
    res.status(200).send({allLoansQuery})
}

const singleLoanById = async(req,res) => {
    const {id} = req.params;
    //console.log("LoanId:",id)
    const {email} = req;
       const checkUserEmail = await UserModel.findOne({email:email})
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const checkLoanId = await LoanModel.findById({_id:id})
    if(!checkLoanId){
        return res.status(400).send("Invalid Loan Id");
    }
    res.status(200).send({message:checkLoanId,success:true})
}

const getLoanByStatus = async(req,res) => {
    const {status} = req.query;
    //console.log("status:",status)
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const loans = await LoanModel.find({$and:[{userId:checkUserEmail._id},{status:`${status}`}]}).populate('customerId');
    res.status(200).send({loans});

}

const deleteLoanById = async(req,res) => {
    const {id} = req.params;
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const checkLoanId = await LoanModel.findById({_id:id})
    if(!checkLoanId){
        return res.status(400).send("Invalid Loan Id");
    }
    await LoanModel.findByIdAndDelete({_id:id})
    res.status(200).send({message:"Loan deleted successfully!"})
}

const loanSummary = async(req,res) => {
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const loans = await LoanModel.find({userId:checkUserEmail._id})
    const repayments = await RepaymentModel.find().populate('loanId')

    const totalLoaned = loans.reduce((sum,loan)=> sum+loan.totalAmount,0);
    const totalCollected = loans.reduce((sum,loan)=> sum+loan.amountPaid,0);
    const overDueAmounts = loans
    .filter(loan=> new Date(loan.dueDate)< new Date() && loan.amountPaid+loan.totalAmount)
    .reduce((sum,loan) => sum+(loan.totalAmount - loan.amountPaid),0);

    //Average Repayment time(in days)
    const avgRepaymentTime = loans.length ? Math.round(
        repayments.reduce((acc,curr) => {
            const loan= curr.loanId;
            console.log("loan:",loan)
            return acc+(new Date(curr.paidAt)-new Date(loan.createdAt));
        },0)/(repayments.length*86400000)
    )
    :0;
    res.status(200).send({loans,totalLoaned,totalCollected,overDueAmounts,avgRepaymentTime});
}

const overDueInfo = async(req,res) => {
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const overDueLoans = await LoanModel.find({userId:checkUserEmail._id,dueDate:{$lt:new Date()}}).populate('customerId');
    // res.status(200).send({overDueLoans})

    const loans = await LoanModel.find({userId:checkUserEmail._id})

    for(let loan of loans){
        if(isBefore(new Date(loan.dueDate),new Date()) && loan.amountPaid<loan.loanAmount){
            loan.status='overdue';
            await loan.save();
        }
    }
    res.status(200).send({overDueLoans})
}


module.exports = {registerLoan,viewAllLoans,singleLoanById,getLoanByStatus,deleteLoanById,loanSummary,overDueInfo} 