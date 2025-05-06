const express = require('express')
const authenticateToken = require('../middleware/authentication')
const { registerLoan, viewAllLoans, singleLoanById,loanSummary, overDueInfo, getLoanByStatus} = require('../controllers/loanController')
const router = express.Router()

router.post("/loan_reg",authenticateToken,registerLoan)
router.get("/all_loans",authenticateToken,viewAllLoans)
router.get("/loans/:id",authenticateToken,singleLoanById)
router.get("/loan_status",authenticateToken,getLoanByStatus)
router.delete("/loans/:id",authenticateToken,singleLoanById)
router.get("/summary",authenticateToken,loanSummary)
router.get("/overdue",authenticateToken,overDueInfo);

module.exports = router