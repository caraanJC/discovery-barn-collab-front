const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');

router.get('/', (req, res) => {
	logs.find().then((data) => {
		res.send(data);
	});
});

module.exports = router;
