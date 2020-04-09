const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log("Index routes ", req.isAuthenticated());
	res.render('dashboard', { userName: req.user.name })
});

module.exports = router;