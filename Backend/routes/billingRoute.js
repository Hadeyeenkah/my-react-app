const express = require('express');
const router = express.Router();
const { addBillingAddress, getBillingAddresses, deleteBillingAddress } = require('../controllers/billingAddress');
const authenticateUserToken = require('../middlewares/authenticateUser');

router.post('/add', authenticateUserToken, addBillingAddress);
router.get('/get', authenticateUserToken, getBillingAddresses);
router.delete('/delete/:billingAddressId', authenticateUserToken, deleteBillingAddress);

module.exports = router;
