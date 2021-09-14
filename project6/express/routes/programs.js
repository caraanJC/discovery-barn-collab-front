const express = require('express');
const router = express.Router();
const logs = require('../models/logs');
const programs = require('../models/programs');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	programs.find().then((data) => {
		res.send(data);
	});
});

router.get('/:id', (req, res) => {
	programs.findById(req.params.id).then((data) => {
		res.send(data);
	});
});

//Create New Row
router.post('/', (req, res) => {
	console.log(req.body);
	programs.count({ name: req.body.name }).then(async (data) => {
		if (data > 0) {
			res.send({ success: false, message: 'Program Name Exists' });
		} else {
			let newProgram = new programs(req.body);
			newProgram.save().then((data) => {
				logActivity(logs, {
					module: 'PROGRAM',
					details: 'Program Created',
					created_date: new Date(),
				});
				res.send({ success: true, message: 'Program created' });
			});
		}
	});
});

//Update Row
router.put('/:id', (req, res) => {
	programs
		.find({
			name: req.body.name,
			_id: { $ne: req.params.id },
		})
		.then((data) => {
			if (data.length > 0) {
				res.send({
					success: false,
					message: 'Program Name Exists',
				});
			} else {
				programs
					.findByIdAndUpdate(req.params.id, {
						$set: {
							name: req.body.name,
							active_flag: req.body.active_flag,
						},
					})
					.then((data) => {
						res.send({ success: true, message: 'Details Updated' });
						logActivity(logs, {
							module: 'PROGRAM',
							details: 'Program Info Updated',
							created_date: new Date(),
						});
					});
			}
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	programs.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'PROGRAM',
			details: 'Program Deleted',
			created_date: new Date(),
		});
	});
});

module.exports = router;
