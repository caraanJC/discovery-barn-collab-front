const mongoose = require('mongoose');
const schema = mongoose.Schema;

const programSchema = new schema({
	name: String,
	active_flag: Boolean,
});

module.exports = mongoose.model('programs', programSchema);
