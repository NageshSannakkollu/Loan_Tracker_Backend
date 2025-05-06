const CustomerModel = require("../models/customerModel");
const UserModel = require("../models/userModel");


const customerReg = async(req,res) => {
    const {email} = req;
    const customerDetails = req.body;
    const checkUserEmail = await UserModel.findOne({email:email})
     console.log("checkValidUser:",checkUserEmail._id)
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const checkValidUser = await UserModel.findById({_id:checkUserEmail._id});
    // console.log("checkValidUser:",checkUserEmail)
    if(checkValidUser === null){
        return res.status(400).send("Invalid User id")
    }
    await CustomerModel.create({...customerDetails,userId:checkUserEmail._id});
    res.status(201).send({message:'New Customer Created successfully',success:true})
}

const singleCustomer = async(req,res) => {
    const {customerId} = req.params;
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    console.log("checkValidUser:",checkUserEmail._id,customerId)
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    
    const singleCustomerWithUser = await CustomerModel.find({_id:customerId})
    console.log("singleCustomer:",singleCustomerWithUser)
    res.status(200).send({singleCustomerWithUser})
}

const allCustomersByUserid = async(req,res) => {
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    //console.log("checkValidUser:",checkUserEmail._id)
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    // console.log("userId:",typeof userId,userId)
    const userCustomers = await CustomerModel.find({userId:`${checkUserEmail._id}`})
    res.status(200).send({userCustomers})
}

const updateCustomer = async(req,res) => {
    const {customerId} = req.params;
    const userDetails = req.body;
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    //console.log("checkValidUser:",checkUserEmail._id)
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const checkCustomer = await CustomerModel.find({$and:[{userId:`${checkUserEmail._id}`},{_id:`${customerId}`}]})
    if(!checkCustomer){
        return res.status(400).send(`Invalid customer Id.`)
    }
    await CustomerModel.findByIdAndUpdate({_id:customerId},{...userDetails,userId:checkUserEmail._id});
    res.status(200).send("Customer updated successfully!")
}

const deleteCustomer = async(req,res) => {
    const {email} = req;
    const checkUserEmail = await UserModel.findOne({email:email})
    //console.log("checkValidUser:",checkUserEmail._id)
    if(!checkUserEmail){
        return res.status(400).send("Invalid User");
    }
    const {customerId} = req.params;
    const checkCustomer = await CustomerModel.find({$and:[{userId:`${checkUserEmail._id}`},{_id:`${customerId}`}]})
    if(!checkCustomer){
        return res.status(400).send("Invalid customer Id");
    }
    await CustomerModel.findByIdAndDelete({_id:customerId});
    res.status(200).send("Customer deleted successfully.")
}

module.exports = {customerReg,singleCustomer,allCustomersByUserid,updateCustomer,deleteCustomer}