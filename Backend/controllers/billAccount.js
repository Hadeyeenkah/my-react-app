const asyncHandler = require('express-async-handler');
const UserAccount = require('../dbModels/userAccSchema');

// Retrieves all bill accounts for a user
const getBillAccounts = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        res.status(200).json(user.bills);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Deletes a bill account from user profile
const deleteBillAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { billAccountId } = req.params;

    const user = await UserAccount.findById(userId);
    if (user) {
        user.bills.id(billAccountId).remove();
        await user.save();
        res.status(200).json(user.bills);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Add a bill to user profile
const addBill = asyncHandler(async (req, res) => {
    const { accountType, accountNumber, provider, amount, status } = req.body;
    const userId = req.user.id;
  
    if (!accountType || !accountNumber || !provider || !amount || !status) {
      res.status(400);
      throw new Error('All fields are required');
    }
    console.log('Request Body:', req.body);
  
    const user = await UserAccount.findById(userId);
    if (user) {
      console.log('User Before:', user);
  
      user.bills.push({ accountType, accountNumber, provider, amount, status });
  
      console.log('User After:', user);
  
      await user.save();
      res.status(201).json(user.bills);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  


// Retrieves all pending bills for the user
const getCurrentBill = asyncHandler(async (req, res) => {
    const { billId } = req.params;
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        const currentBill = user.bills.id(billId);
         if (!currentBill) {
            res.status(404);
            throw new Error('Bill not found');
        }
        res.status(200).json(currentBill);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Retrieves all paid bills for the user
const getPastBills = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await UserAccount.findById(userId);
    if (user) {
        const pastBills = user.bills.filter(bill => bill.status === 'paid');
        res.status(200).json(pastBills);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Retrieves details of a specific bill
const getBillDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { billId } = req.params;

    const user = await UserAccount.findById(userId);
    if (user) {
        const bill = user.bills.id(billId);
        if (bill) {
            res.status(200).json(bill);
        } else {
            res.status(404);
            throw new Error('Bill not found');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


//  Update status of a bill e.g from pending to paid
// In your bill controller file
const updateBillStatus = asyncHandler(async (req, res) => {
    const { billId, status } = req.body;

    if (!billId || !status) {
        res.status(400);
        throw new Error('Bill ID and status are required!');
    }

    const bill = await BillAccount.findById(billId);

    if (!bill) {
        res.status(404);
        throw new Error('Bill not found');
    }

    bill.status = status;
    await bill.save();

    res.status(200).json({ message: 'Bill status updated successfully' });
});



module.exports = {  getBillAccounts, deleteBillAccount, addBill, getCurrentBill, getPastBills, getBillDetails, updateBillStatus };
