const express = require('express');
const router = express.Router();
const { getBillAccounts, deleteBillAccount, addBill, getCurrentBill, getPastBills, getBillDetails, updateBillStatus } = require('../controllers/billAccount'); 
const authenticateUserToken = require('../middlewares/authenticateUser');

// router.post('/add', authenticateUserToken, addBillAccount);
router.get('/get', authenticateUserToken, getBillAccounts);
router.delete('/delete/:billAccountId', authenticateUserToken, deleteBillAccount);

router.post('/add-bill', authenticateUserToken, addBill);
router.get('/:billId', authenticateUserToken, getCurrentBill);
router.get('/past-bills', authenticateUserToken, getPastBills);
router.get('/bill-details/:billId', authenticateUserToken, getBillDetails);
router.put('/update-bill-status', authenticateUserToken, updateBillStatus);

module.exports = router;
