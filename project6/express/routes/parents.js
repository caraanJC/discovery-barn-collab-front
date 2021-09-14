const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');
const parents = require('../models/parents');
const students = require('../models/students');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	parents.find().then((data) => {
		res.send(data);
	});
});

router.get('/get-students/:id', (req, res) => {
	students.find({ parent_id: req.params.id }).then((data) => {
		res.send(data);
	});
});

//Create New Row
router.post('/', (req, res) => {
	console.log(req.body);
	parents
		.count({ email_address: req.body.email_address })
		.then(async (data) => {
			if (data > 0) {
				res.send({ success: false, message: 'Email Exists' });
			} else {
				let hashedPassword = await bcrypt.hash(req.body.password, 10);
				req.body.password = hashedPassword;
				let newParent = new parents(req.body);
				newParent.save().then((data) => {
					logActivity(logs, {
						module: 'PARENT',
						details: 'Parent Created',
						created_date: new Date(),
					});
					res.send({ success: true, message: 'Parent created' });
				});
			}
		});
});

router.post('/login', (req, res) => {
	parents
		.find({ email_address: req.body.email_address })
		.then(async (data) => {
			if (data.length > 0) {
				let hashedPassword = data[0].password;

				let match = await bcrypt.compare(
					req.body.password,
					hashedPassword
				);

				if (match) {
					if (data[0].active_flag == true) {
						res.send({
							success: true,
							nameOfUser: data[0].first_name,
							userKey: data[0]._id,
						});
					} else {
						res.send({
							success: false,
							message: 'Account is currently deactivated',
						});
					}
				} else {
					res.send({
						success: false,
						message: 'Invalid Credentials',
					});
				}
			} else {
				res.send({ success: false, message: 'Invalid Email' });
			}
		});
});

//Update Row
router.put('/:id', (req, res) => {
	parents
		.find({
			email_address: req.body.email_address,
			_id: { $ne: req.params.id },
		})
		.then((data) => {
			if (data.length > 0) {
				res.send({
					success: false,
					message: 'Email address already exists',
				});
			} else {
				parents
					.findByIdAndUpdate(req.params.id, {
						$set: {
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							email_address: req.body.email_address,
							active_flag: req.body.active_flag,
						},
					})
					.then((data) => {
						res.send({ success: true, message: 'Details Updated' });
						logActivity(logs, {
							module: 'PARENT',
							details: 'Parent Info Updated',
							created_date: new Date(),
						});
					});
			}
		});
});

router.put('/update-password/:id', async (req, res) => {
	let hashedPassword = await bcrypt.hash(req.body.password, 10);
	parents
		.findByIdAndUpdate(req.params.id, {
			$set: { password: hashedPassword },
		})
		.then((data) => {
			res.send({ success: true });
			logActivity(logs, {
				module: 'PARENT',
				details: 'Parent Password Updated',
				created_date: new Date(),
			});
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	parents.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'PARENT',
			details: 'Parent Deleted',
			created_date: new Date(),
		});
	});
});

module.exports = router;
