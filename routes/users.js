const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// create application/json parser
// var jsonParser = bodyParser.json();

let isAuthenticated = false;
let userName = '';

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/login', (req, res) => { res.render('login') });

router.get('/register', (req, res) => { res.render('register') });

// router.get('/dashboard', ensureAuthenticated, (req, res) => {
//     console.log("Index routes ", req.isAuthenticated());
// 	res.render('dashboard', { userName: req.user.name })
// });

// https://github.com/jaredhanson/passport/issues/482

// hack for restricting access to dashboard route

router.get('/dashboard', (req, res) => {
    if(isAuthenticated){
        return res.render('dashboard', { userName: userName });
    } else {
        return res.redirect('/users/login');
    }
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please fill in all the fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ message: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ message: 'Passwords should be atleast 6 character long' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ message: 'User with same email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email
                    })
                } else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    });

                    const bcrypt = require('bcrypt');
                    const saltRounds = 10;

                    // Store hash in your password DB.
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        if (err) throw err;
                        // set password to hashed
                        newUser.password = hash;
                        // save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_message', 'You are now registered and can log in!');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log("Error in saving user", err));
                    });
                }
            });
    }
});

// Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        console.log('error on userController.js post /login err', err);
        return err;
      }
      if (!user) {
        req.flash('info');
        return res.redirect('/users/login');
      }
      req.logIn(user, (logInErr) => {
        if (logInErr) {
          console.log('error on userController.js post /login logInErr', logInErr); return logInErr;
        }
        // return res.status(200).json(user[0]);
        req.session.save(() => {
            isAuthenticated = req.isAuthenticated();
            userName = req.user.name;
            res.redirect('/users/dashboard')
        });
      });
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    isAuthenticated = false;
    userName = '';
    req.logout();
    req.flash('success_message', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;