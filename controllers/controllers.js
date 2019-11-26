// const mongoose = require('mongoose');
const Persons = require('../modules/userSchema');
const Token = require('../modules/tokenSchema');
const Chips = require('../modules/chipsSchema');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// POST /register
exports.register = (req, res) => {
	// Form validation
	const { error, isValid } = validateRegisterInput(req.body);
	const { firstName, lastName, email, password } = req.body;
	// Check validation
	if (!isValid) {
		return res.json({
			status: 'error',
			error: error
		});
	}
	// Make sure this account doesn't already exist
	Persons.findOne({ email: email }, (err, user) => {
		// Make sure user doesn't already exist
		if (user) {
			return res.json({
				status: 'error',
				msg: 'The email address you have entered is already associated with another account.'
			});
		}
		// Create and save the user
		user = new Persons({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
		});
		// hash passport
		// genSalt is a method for bcrypt and 10 is number of characters
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) console.log(err);
				// set password to hashed
				user.password = hash;
				// save user
				user.save((err) => {
					if (err) {
						return res.json({
							status: 'error',
							msg: 'An unexpected error occurred. Please try again later.'
						});
					}
					// Create a verification token for this user
					let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
					// Save the verification token
					token.save((err) => {
						if (err) {
							return res.json({
								status: 'error',
								msg: 'An unexpected error occurred. Please try again later.'
							});
						}
						res.json({
							status: 'success',
							user
						});
						// Send the email
						let transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
						});
						let mailOptions = {
							from: process.env.EMAIL,
							to: user.email,
							subject: 'Account Verification Token',
							text:
								`Hello ${user.firstName},\n\n` +
								'Please verify your account by clicking the link: \n https://supercode-superproject.herokuapp.com' +
								'/confirmation/' +
								token.token
						};
						transporter.sendMail(mailOptions, (err) => {
							if (err) {
								return res.json({
									status: 'error',
									msg: 'An unexpected error occurred. Please try again later.'
								});
							}
							res.json({
								status: 'success',
								result: `A verification email has been sent to ${user.email} \n Please check your email`
							});
						});
					});
				});
			});
		});
	});
};
// POST /login
exports.login = (req, res) => {
	// Form validation
	const { error, isValid } = validateLoginInput(req.body);
	const { email, password } = req.body;
	// Check validation
	if (!isValid) {
		return res.json({
			status: 'error',
			error
		});
	}
	Persons.findOne({ email: email }, (err, user) => {
		if (!user) {
			return res.json({
				status: 'isNotUser',
				msg: `This email address is not associated with any account. Double-check your email address and try again.`
			});
		}
		// Make sure the email and password is match
		bcrypt.compare(password, user.password, (err, isMatch) => {
			if (!isMatch) {
				return res.json({
					status: 'error',
					msg: 'Invalid email or password'
				});
			}
			// Make sure the user has been verified
			if (!user.isVerified) {
				return res.json({
					status: 'isNotVerified',
					isVerified: false
				});
			}
			// Make sure the user has a role
			if (user.roles[0] === 'Null') {
				return res.json({
					status: 'error',
					msg: `Your account has not been accepted by the admin, please ask your admin.!`
				});
			}
			// User matched
			// Create JWT Payload
			const payload = {
				id: user.id,
				firstName: user.firstName,
				roles: user.roles
			};
			// Sign token
			jwt.sign(
				payload,
				keys.secretOrKey,
				{
					expiresIn: 31556926 // 1 year in seconds
				},
				(err, token) => {
					res.json({
						status: 'success',
						token: 'Bearer ' + token,
						user: user
					});
				}
			);
		});
	});
};
// PST /forgotPassword
exports.forgotPassword = (req, res) => {
	const { email } = req.body;
	Persons.findOne({ email: email }, (err, user) => {
		if (!user) {
			return res.json({
				status: 'error',
				msg: `This email address is not associated with any account. Double-check your email address and try again.`
			});
		}
		// Create a Password Reset Token for this user
		const token = crypto.randomBytes(16).toString('hex');

		user.passwordResetToken = token;
		user.passwordResetExpires = Date.now() + 360000;
		user.save((err) => {
			if (err) {
				return res.json({
					status: 'error',
					msg: 'An unexpected error occurred. Please try again later.'
				});
			}
		});
		// Send the email
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
		});
		let mailOptions = {
			from: process.env.EMAIL,
			to: user.email,
			subject: 'Link to Reset Password',
			text:
				`Hello ${user.firstName},\n\n` +
				'you are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link: \n' +
				`https://supercode-superproject.herokuapp.com/resetPassword/${token}\n\n` +
				'if you did not request this, please ignore this email and your password will remain unchanged.'
		};
		transporter.sendMail(mailOptions, (err) => {
			if (err) {
				return res.json({
					status: 'error',
					msg: 'An unexpected error occurred. Please try again later.'
				});
			}
			res.json({
				status: 'success',
				result: `A Reset Password email has been sent to ${user.email} \n Please check your email`
			});
		});
	});
};
// POST /resetPassword
exports.resetPassword = (req, res) => {
	Persons.findOne({ passwordResetToken: req.params.id }).then((user) => {
		if (!user) {
			return res.json({
				status: 'error',
				msg: 'Password reset link is invalid or has expired'
			});
		}
		res.json({
			status: 'success',
			email: user.email
		});
	});
};
// POST /updatePasswordViaEmail
exports.updatePasswordViaEmail = (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);
	Persons.findOne({ email: email }).then((user) => {
		if (!user) {
			return res.json({
				status: 'error',
				msg:
					'This email address is not associated with any account. Double-check your email address and try again.'
			});
		}
		user.password = password;
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					return res.json({
						status: 'error',
						msg: err
					});
				}
				// set password to hashed && reset password token and expires time
				user.password = hash;
				user.passwordResetToken = null;
				user.passwordResetExpires = null;

				user.save((err) => {
					if (err) {
						return res.json({
							status: 'error',
							msg: 'An unexpected error occurred. Please try again later.'
						});
					}
					res.json({
						status: 'success',
						user: user
					});
				});
			});
		});
	});
};
// POST /confirmation:id
exports.confirmationPost = (req, res) => {
	// Find a matching token
	Token.findOne({ token: req.params.id }, (err, token) => {
		if (!token) {
			return res.json({
				status: 'error',
				msg: 'Email verify link is invalid or has expired'
			});
		}
		// If we found a token, find a matching user
		Persons.findOne({ _id: token._userId }, (err, user) => {
			if (!user) {
				return res.json({
					status: 'error',
					msg: 'We were unable to find a user for this email.'
				});
			}
			if (user.isVerified) {
				return res.json({
					status: 'success',
					msg: 'This account has already been verified.'
				});
			}
			// Verify and save the user
			user.isVerified = true;
			user.save((err) => {
				if (err) {
					return res.json({
						status: 'error',
						msg: 'An unexpected error occurred. Please try again later.'
					});
				}
				res.json({
					status: 'success',
					msg: 'Thank you for register, your account has been verified.!'
				});
			});
		});
	});
};
// POST /resend
exports.resendTokenPost = (req, res) => {
	const { email } = req.body;
	Persons.findOne({ email: email }, (err, user) => {
		if (!user) {
			return res.json({
				status: 'error',
				msg: 'We were unable to find a user for this email.'
			});
		}
		if (user.isVerified) {
			return res.json({
				status: 'error',
				msg: 'This account has already been verified.'
			});
		}
		// Create a verification token, save it, and send email
		let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
		// Save the token
		token.save((err) => {
			if (err) {
				return res.json({
					status: 'error',
					msg: 'An unexpected error occurred. Please try again later.'
				});
			}
			// Send the email
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
			});
			let mailOptions = {
				from: process.env.EMAIL,
				to: user.email,
				subject: 'Account Verification Token',
				text:
					`Hello ${user.firstName},\n\n` +
					'Please verify your account by clicking the link: \n https://supercode-superproject.herokuapp.com' +
					'/confirmation/' +
					token.token
			};
			transporter.sendMail(mailOptions, (err) => {
				if (err) {
					return res.json({
						status: 'error',
						msg: 'An unexpected error occurred. Please try again later.'
					});
				}
				res.json({
					status: 'success',
					msg: `A verification email has been sent to ${user.email}`
				});
			});
		});
	});
};
// GET /persons
exports.getAllPersons = (req, res) => {
	Persons.find({}, (err, persons) => {
		if (err) {
			console.log(err);
			res.json({
				status: 'error',
				msg: 'Something went wrong while getting the data please refresh the page again'
			});
		} else {
			res.json({
				status: 'success',
				persons: persons
			});
		}
	});
};
// POST /editPerson
exports.editPersonsData = (req, res) => {
	const newUserData = {
		$set: {
			firstName: req.body.firstName,
			email: req.body.email,
			rfId: req.body.rfId,
			roles: req.body.roles
		}
	};
	Persons.findOneAndUpdate({ _id: req.body._id }, newUserData, { useFindAndModify: false })
		.then((updatedDocument) => {
			if (updatedDocument) {
				res.json({
					status: 'success',
					updatedDocument: updatedDocument
				});
			} else {
				res.json({
					status: 'error',
					msg: 'This Person is not associated with any account.'
				});
			}
		})
		.catch((err) => console.log(`Failed to find and update document: ${err}`));
};
// GET /chips
exports.getAllChips = (req, res) => {
	Chips.find({}, (err, chips) => {
		if (err) {
			console.log(err);
			res.json({
				status: 'error',
				msg: 'Something went wrong while getting the data please refresh the page again'
			});
		} else {
			res.json({
				status: 'success',
				chips: chips
			});
		}
	});
};
