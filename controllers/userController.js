const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const DbConnection = require("../config/database");
const UserModel = require("../models/userModel");

const DbActiveConnection = async() => {
    await DbConnection()
}
DbActiveConnection()

const userRegistration = async(req,res) => {
    const {username,email,password,role} = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    const userDetails = {
        username:username,
        password:hashedPassword,
        email:email,
        role:role
    }
    const checkEmail = await UserModel.findOne({email:email})
    // console.log(checkEmail)
    if(!checkEmail){
        const userRes = await UserModel.create(userDetails);
        res.status(201).send({message:'New user Created successfully',userRes,success:true})
        
    }
    res.status(400).send("Email already exists,Please try with new Email")
    // res.status(200).send({userDetails})
}

const userLogin = async(req,res) => {
    const {email,password} = req.body;
    const checkEmail = await UserModel.findOne({email:email})
    if(checkEmail === null){
        return res.status(400).send("Invalid Email address");
    }
    const isPasswordMatch = await bcrypt.compare(password,checkEmail.password);
    if(isPasswordMatch){
        const payload = {email:email}
        const jwtToken = jwt.sign(payload,process.env.MY_SECRET_KEY)
        //localStorage.setItem("jwtToken",jwtToken)
        res.status(200).send({jwtToken:jwtToken})
    }
    res.status(400).send('Invalid Password.')
}

module.exports = {userRegistration,userLogin}