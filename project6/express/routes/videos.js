const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');
const videos = require('../models/videos');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	videos
		.aggregate([
			{
				$lookup: {
					from: 'programs',
					localField: 'program_id',
					foreignField: '_id',
					as: 'programinfo',
				},
			},
		])
		.then((data) => {
			res.send(data);
		});
});

router.get('/info/:id', (req, res) => {
	videos.findById(req.params.id).then((data) => {
		res.send(data);
	});
});

router.get('/:id', (req, res) => {
	videos.find({ program_id: req.params.id }).then((data) => {
		res.send(data);
	});
});

//Create New Row
router.post('/', (req, res) => {
	let newVideo = new videos(req.body);
	newVideo.save().then((data) => {
		logActivity(logs, {
			module: 'VIDEO',
			details: 'Video Created',
			created_date: new Date(),
		});
		res.send({ success: true, message: 'Video created' });
	});
});

//Update Row
router.put('/:id', (req, res) => {
	videos
		.findByIdAndUpdate(req.params.id, {
			$set: {
				title: req.body.title,
				description: req.body.description,
				program_id: req.body.program_id,
				lesson_date: req.body.lesson_date,
				thumbnail_path: req.body.thumbnail_path,
				video_path: req.body.video_path,
				active_flag: req.body.active_flag,
			},
		})
		.then((data) => {
			res.send({ success: true, message: 'Details Updated' });
			logActivity(logs, {
				module: 'VIDEO',
				details: 'Video Info Updated',
				created_date: new Date(),
			});
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	videos.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'Video',
			details: 'Video Deleted',
			created_date: new Date(),
		});
	});
});

module.exports = router;
