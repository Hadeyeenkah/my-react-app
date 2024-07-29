const express =  require ('express');
const router = express.Router();
const { addPaymentMethod, getPaymentMethods, deletePaymentMethod } = require('../controllers/paymentMethods');
const authenticateUserToken = require('../middlewares/authenticateUser');
const { processPayment, confirmPayment, getPaymentHistory } = require('../controllers/payment');


router.post('/add', authenticateUserToken, addPaymentMethod);
router.get('/get', authenticateUserToken, getPaymentMethods);
router.delete('/delete/:paymentMethodId', authenticateUserToken, deletePaymentMethod);

router.post('/process', authenticateUserToken, processPayment);
router.post('/confirm', confirmPayment);
router.get('/history', authenticateUserToken, getPaymentHistory);

module.exports = router;
