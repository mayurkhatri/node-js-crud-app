const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model

const User = require('../models/user');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			// Match User
			User.findOne({ email: email })
				.then(user => {
					if (!user) {
						return done(null, false, { message: 'That email is not registered' });
					}

					bcrypt.compare(password, user.password, (error, isMatch) => {
						if (error) throw error;

						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: 'Password Incorrect' });
						}
					})
				})
				.catch(err => console.log(err));
		})
	);

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
}