require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 3000;
const colors = require('colors');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Create connection to MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database'.blue.rainbow);
});

// Serve static files
app.use(express.static('public'));

// Register a new user
app.post('/api/user/register', (req, res) => {
  const { username, email, password } = req.body;
  console.log('Recieved data:', req.body);
  console.log('Password:', password);

  const saltRounds = 10; // Number of salt rounds
  let hashedPassword;

  try {
    hashedPassword = bcrypt.hashSync(password, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send('Failed to register user');
  }

  const uuid = uuidv4();
  
  db.query(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [uuid, username, email, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('Failed to register user:', err);
        res.status(500).send('Failed to register user');
      } else {
        console.log('User registered successfully');
        res.status(200).send('User registered');
      }
    }
  );
});

// login a user
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        console.error('Failed to login:', err);
        res.status(500).send('Failed to login');
      } else {
        if (result.length === 0) {
          res.status(401).send('User not found');
        } else {
          const user = result[0];
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
              expiresIn: '1h'
            });
            res.status(200).send({ token });
          } else {
            res.status(401).send('Invalid email or password');
          }
        }
      }
    }
  );
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`.magenta.italic.bold);
}
);