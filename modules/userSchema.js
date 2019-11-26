const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String },
	email: { type: String, unique: true, required: true },
	isVerified: { type: Boolean, default: false },
	rfId: { type: String, default: 'Null' },
	roles: { type: Array, default: 'Null' },
	password: { type: String, required: true },
	passwordResetToken: { type: String },
	passwordResetExpires: Date
});

let persons = mongoose.model('persons', userSchema);

module.exports = persons;
