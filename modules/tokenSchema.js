const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Persons' },
	token: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

let token = mongoose.model('token', tokenSchema);

module.exports = token;
