const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/users', require('./routes/userRoute'));

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server running on port ${port}`.magenta.italic.bold);
}
);