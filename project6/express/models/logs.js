const mongoose = require('mongoose');
const schema = mongoose.Schema;

const logSchema = new schema({
	module: String,
	details: String,
	created_date: Date,
	created_by: String,
});

module.exports = mongoose.model('logs', logSchema);
