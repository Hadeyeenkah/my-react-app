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


const corsOptions = {
  origin:'https://my-react-5grlsarfj-cassandra18s-projects.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`Response headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});



app.options('*', cors(corsOptions));

app.use('/api/users', require('./routes/userRoute'));

app.use(errorHandler);

// Backend start link
app.get('/', (req, res) => {

  res.send('Welcome to My Blog App Backend side');

});
app.listen(port, () => {
  console.log(`Server running on port ${port}`.magenta.italic.bold);
}
);