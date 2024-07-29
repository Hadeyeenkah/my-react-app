const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authenticateUserToken = require('../middlewares/authenticateUser');

// Public routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(authenticateUserToken); // Apply authentication to all routes below this line

router.get('/me', userController.getMe);
router.put('/me', userController.updateUser);
router.delete('/me', userController.deleteUser);

module.exports = router;
