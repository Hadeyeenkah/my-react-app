const crypto = require('crypto');

const PAYSTACK_SECRET_KEY = `${process.env.PAYSTACK_SECRET_KEY}`;
const payload = JSON.stringify({
  "event": "charge.success",
  "data": {
    "reference": "paystack_ref_1722439188168",
    "amount": 1000,
    "metadata": {
      "billId": "66aa55d2d20da87f69651e11",
      "userId": "66a9141dce6ebb9e91c3bbd1"
    }
  }
});

const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');

console.log('x-paystack-signature:', hash);
