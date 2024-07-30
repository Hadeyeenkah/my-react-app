const mongoose = require('mongoose');

// const paymentMethodSchema = new mongoose.Schema({
//     cardNumber: String,
//     expiryDate: String,
//     cardHolderName: String
// }, { _id: false });

const billingAddressSchema = new mongoose.Schema({
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
}, { timestamps: true});

// const billAccountSchema = new mongoose.Schema({
//     accountType: { type: String, required: true }, // e.g., electricity, water, internet
//     accountNumber: { type: String, required: true },
//     provider: { type: String, required: true },
//     nickname: { type: String } // Optional, for user convenience
// }, { timestamps: true });

const billSchema = new mongoose.Schema({
    accountType: { type: String, required: true },
    accountNumber: { type: String, required: true },
    provider: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' } // e.g., pending, paid
  }, { timestamps: true });

const paymentMethodSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., 'credit_card', 'mobile_money', 'bank_transfer'
    details: { type: mongoose.Schema.Types.Mixed, required: true }, // Store card details, mobile money info, etc.
    nickname: { type: String } // Optional, for user convenience
}, { timestamps: true });

const paymentHistorySchema = new mongoose.Schema({
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: paymentMethodSchema, required: true },
    status: { type: String, required: true, default: 'pending' }, // e.g., 'pending', 'completed', 'failed'
    receipt: { type: String } // Store receipt URL or details
}, { timestamps: true });

const userAccSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentMethods: [paymentMethodSchema],
    paymentHistory: [paymentHistorySchema],
    billingAddresses: [billingAddressSchema],
    bills: [billSchema],
  }, { timestamps: true });



module.exports = mongoose.model('UserAccount', userAccSchema);
