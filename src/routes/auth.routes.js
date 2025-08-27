const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Route for the login page
router.get('/login', authController.renderLoginPage);

// Handle login form submission
router.post('/login', authController.loginUser);

// Route for the register page
router.get('/register', authController.renderRegisterPage);

// Handle register form submission
router.post('/register', authController.registerUser);

// Route for the forgot password page
router.get('/forgot-password', authController.renderForgotPasswordPage);

// Route for logout
router.get('/logout', authController.logoutUser);

router.get('/test', authController.testRoute);


module.exports = router;