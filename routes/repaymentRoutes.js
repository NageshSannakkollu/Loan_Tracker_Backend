const express = require('express')
const authenticateToken = require('../middleware/authentication')
const { createRepayment } = require('../controllers/repaymentController')
const { loanSummary } = require('../controllers/loanController')

const router = express.Router()

router.post("/create_repayment",authenticateToken,createRepayment)

module.exports = router;