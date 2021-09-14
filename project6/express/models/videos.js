const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const videoSchema = new schema({
	title: String,
	description: String,
	program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'programs' },
	lesson_date: Date,
	thumbnail_path: String,
	video_path: String,
	active_flag: Boolean,
});

module.exports = mongoose.model('videos', videoSchema);
