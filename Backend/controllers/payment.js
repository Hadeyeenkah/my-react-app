const axios = require('axios');
const UserAccount = require('../dbModels/userAccSchema');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { builtinModules } = require('module');

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

    const bill = user.bills.id(billId);
    if (!bill) {
        res.status(400).json({ message: 'Bill not found' });
        return;
    }

    // Create a payment initialization with Paystack
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: user.email,
        amount: amount * 100, // convert to kobo
        reference: `paystack_ref_${Date.now()}`,
        metadata: {
            billId,
            userId
        }
    }, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    
    const { authorization_url, reference } = response.data.data;
    res.status(200).json({ authorization_url, reference });
});

// Handle Paystack payment callback

const paystackWebhook = asyncHandler(async (req, res) => {
    console.log('Received webhook event:', req.body);
    const paystackSignature = req.headers['x-paystack-signature'];
    const event = req.body;

    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(event)).digest('hex');

    console.log('Received payload:', event);
    console.log('Computed hash:', hash);
    console.log('Provided signature:', paystackSignature);

    if (hash !== paystackSignature) {
        return res.status(400).send('Invalid signature');
    }

    if (event.event === 'charge.success') {
        const { reference, amount, metadata } = event.data;
        const { billId, userId } = metadata;

        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            });

            if (response.data.status) {
                const paymentData = response.data.data;
                const user = await UserAccount.findById(userId);

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const bill = user.bills.id(billId);
                if (bill) {
                    bill.status = 'paid';
                    const paymentHistory = {
                        billId: bill._id,
                        amount: paymentData.amount / 100,
                        paymentMethod: {
                            type: 'paystack',
                            details: { reference }
                        },
                        status: 'completed',
                        receipt: paymentData.receipt_url
                    };
                    user.paymentHistory.push(paymentHistory);
                    await user.save();

                    return res.status(200).send('Payment verified and payment history updated');
                } else {
                    return res.status(400).json({ message: 'Bill not found' });
                }
            } else {
                return res.status(400).send('Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            return res.status(500).send('An error occurred while verifying the payment');
        }
    }

    res.sendStatus(200);
});

// Retrieve the payment history for a user.
const getPaymentHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await UserAccount.findById(userId);
        if (user) {
            console.log('User payment history:', user.paymentHistory);
            res.status(200).json(user.paymentHistory);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: 'Error fetching payment history' });
    }
});

module.exports = { processPayment, paystackWebhook, getPaymentHistory };
