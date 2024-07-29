const asyncHandler = require('express-async-handler');
const UserAccount = require('../dbModels/userAccSchema');

// Adds a new payment method to a user's profile.
const addPaymentMethod = asyncHandler(async (req, res) => {
    const { type, details,nickname } = req.body;
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        user.paymentMethods.push({ type, details, nickname });
        await user.save();
        res.status(201).json(user.paymentMethods);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Retrieves all payment methods for a user
const getPaymentMethods = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        res.status(200).json(user.paymentMethods);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Removes a payment method from a user's profile
const deletePaymentMethod = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { paymentMethodId } = req.params;

    const user = await UserAccount.findById(userId);
    if (user) {
        user.paymentMethods.id(paymentMethodId).remove();
        await user.save();
        res.status(200).json(user.paymentMethods);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { addPaymentMethod, getPaymentMethods, deletePaymentMethod };
