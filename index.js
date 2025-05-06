const express = require('express')
const app = express()
const cors =  require('cors');
//const DbConnection = require('./config/database');
const userDetailsRoute = require("./routes/userRoutes");
const customerDetailsRoute = require("./routes/customerRoutes");
const loanDetailsRoute = require("./routes/loanRoutes");
const repaymentDetailsRoute = require("./routes/repaymentRoutes");
app.use(express.json())
app.use(cors())
require('dotenv').config()

app.use("/auth",userDetailsRoute)
app.use("/api/customer/",customerDetailsRoute)
app.use("/api/loan",loanDetailsRoute)
app.use("/api/repayment",repaymentDetailsRoute);

const port = 3030||process.env.PORT;

app.listen(port,async() => {
    console.log(`Server running at: http://localhost:${port}/`)
})

