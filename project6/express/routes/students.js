const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');
const students = require('../models/students');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	students
		.aggregate([
			{
				$lookup: {
					from: 'parents',
					localField: 'parent_id',
					foreignField: '_id',
					as: 'parentinfo',
					pipeline: [
						{
							$project: {
								parent_name: {
									$concat: ['$first_name', ' ', '$last_name'],
								},
							},
						},
					],
				},
			},
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

//Create New Row
router.post('/', (req, res) => {
	let newParent = new students(req.body);
	newParent.save().then((data) => {
		logActivity(logs, {
			module: 'PARENT',
			details: 'Parent Created',
			created_date: new Date(),
		});
		res.send({ success: true, message: 'Parent created' });
	});
});

//Update Row
router.put('/:id', (req, res) => {
	students
		.findByIdAndUpdate(req.params.id, {
			$set: {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				age: req.body.age,
				parent_id: req.body.parent_id,
				program_id: req.body.program_id,
			},
		})
		.then((data) => {
			res.send({ success: true, message: 'Details Updated' });
			logActivity(logs, {
				module: 'STUDENT',
				details: 'Student Info Updated',
				created_date: new Date(),
			});
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	students.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'STUDENT',
			details: 'Student Deleted',
			created_date: new Date(),
		});
	});
});

module.exports = router;
