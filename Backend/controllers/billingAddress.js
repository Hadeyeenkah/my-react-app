const asyncHandler = require('express-async-handler');
const UserAccount = require('../dbModels/userAccSchema');

// manage billing addresses

// Add a billing address to user profile
const addBillingAddress = asyncHandler(async (req, res) => {
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        user.billingAddresses.push({ addressLine1, addressLine2, city, state, postalCode, country });
        await user.save();
        res.status(201).json(user.billingAddresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Retrieves all billing addresses for a user
const getBillingAddresses = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        res.status(200).json(user.billingAddresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Deletes a billing address from user profile
const deleteBillingAddress = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { billingAddressId } = req.params;

    const user = await UserAccount.findById(userId);
    if (user) {
        user.billingAddresses.id(billingAddressId).remove();
        await user.save();
        res.status(200).json(user.billingAddresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { addBillingAddress, getBillingAddresses, deleteBillingAddress };
