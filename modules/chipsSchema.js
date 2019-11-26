const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chipsSchema = new Schema({
	_id: { type: String, required: true },
	chipNumber: { type: String, required: true },
	swipes: { type: Array, required: true }
});

let Chips = mongoose.model('chips', chipsSchema);

module.exports = Chips;
