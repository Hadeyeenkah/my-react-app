const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');


const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.options('*', cors());

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/payment', require('./routes/paymentRoute'));
app.use('/api/bill-address', require('./routes/billingRoute'));
app.use('/api/bill-account', require('./routes/billAccountsRoute'));
app.use(errorHandler);

// Backend start link
app.get('/', (req, res) => {

  res.send('Welcome to My Blog App Backend side');

});
app.listen(port, () => {
  console.log(`Server running on port ${port}`.magenta.italic.bold);
}
);