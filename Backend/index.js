const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

connectDB();

app.options('*', cors(corsOptions));

app.use('/api/users', require('./routes/userRoute'));

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server running on port ${port}`.magenta.italic.bold);
}
);