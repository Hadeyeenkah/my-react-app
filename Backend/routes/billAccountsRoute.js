const express = require('express');
const router = express.Router();
const { getBillAccounts, deleteBillAccount, addBill, getCurrentBills, getPastBills, getBillDetails, updateBillStatus } = require('../controllers/billAccount'); 
const authenticateUserToken = require('../middlewares/authenticateUser');

// router.post('/add', authenticateUserToken, addBillAccount);
router.get('/get', authenticateUserToken, getBillAccounts);
router.delete('/delete/:billAccountId', authenticateUserToken, deleteBillAccount);

router.post('/add-bill', authenticateUserToken, addBill);
router.get('/current-bills', authenticateUserToken, getCurrentBills);
router.get('/past-bills', authenticateUserToken, getPastBills);
router.get('/bill-details/:billId', authenticateUserToken, getBillDetails);
router.put('/update-status/:billId', authenticateUserToken, updateBillStatus);

module.exports = router;
