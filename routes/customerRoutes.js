const express = require('express')
const router = express.Router()

const { customerReg, singleCustomer, allCustomersByUserid,deleteCustomer,updateCustomer } = require("../controllers/customerController")
const authenticateToken = require('../middleware/authentication')


router.post('/register',authenticateToken,customerReg)
router.get("/all_customers",authenticateToken,allCustomersByUserid)
router.get("/:customerId",authenticateToken,singleCustomer)
router.delete("/:customerId",authenticateToken,deleteCustomer)
router.put("/:customerId",authenticateToken,updateCustomer)

module.exports = router