const axios = require('axios');
const UserAccount = require('../dbModels/userAccSchema');
const asyncHandler = require('express-async-handler');
//const sendSMS = require('../utils/message');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


// Initiate a payment transaction for a bill.
const processPayment = asyncHandler(async (req, res) => {
    const { billId, amount } = req.body;
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // const paymentMethod = user.paymentMethods.id(paymentMethodId);
    // if (!paymentMethod) {
    //     res.status(400);
    //     throw new Error('Payment method not found');
    // }

    const bill = user.bills.id(billId);
    if (!bill) {
        res.status(400);
        throw new Error('Bill not found');
    }

    // Create a payment initialization with Paystack
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: user.email,
        amount: amount * 100, // convert to kobo
        reference: `paystack_ref_${Date.now()}`,
        // metadata: {
        //     paymentMethodId
        // }
    }, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const { authorization_url, reference } = response.data.data;
    console.log('Paystack response:', response.data);
    // // Notify user via SMS
    // const smsMessage = `Your payment of ${amount} is being processed. Please complete your payment using this link: ${authorization_url}.`;
    // await sendSMS(user.phoneNumber, smsMessage);

    // Redirect the user to the Paystack payment page
    res.status(200).json({ authorization_url, reference });
});


// Confirm a payment transaction initiated by the user.
const confirmPayment = asyncHandler(async (req, res) => {
    const { reference } = req.body;
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Verify the transaction status with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
    });

    const { status, amount, receipt_url, metadata } = response.data.data;

    if (status === 'success') {
        // Update bill and payment history
        const bill = user.bills.id(metadata.billId);
        if (bill) {
            bill.status = 'paid';
            const paymentHistory = {
                billId: bill._id,
                amount: amount / 100, // convert back to the original currency
                paymentMethod: {
                    type: 'paystack',
                    details: { reference }
                },
                status: 'completed',
                receipt: receipt_url
            };
            user.paymentHistory.push(paymentHistory);
            await user.save();

            res.status(200).json(paymentHistory);
        } else {
            res.status(400);
            throw new Error('Bill not found');
        }
    } else {
        res.status(400);
        throw new Error('Payment verification failed');
    }
});


// Retrieve the payment history for a user.
const getPaymentHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        res.status(200).json(user.paymentHistory);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { processPayment, confirmPayment, getPaymentHistory };
