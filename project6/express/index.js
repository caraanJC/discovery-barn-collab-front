const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const programRouter = require('./routes/programs');
const userRouter = require('./routes/users');
const logRouter = require('./routes/logs');
const parentRouter = require('./routes/parents');
const studentRouter = require('./routes/students');
const videoRouter = require('./routes/videos');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

//DB CONNECTION
const db = 'DistanceLearning';
const host = 'mongodb://localhost:27017';
const connectionStr = `${host}/${db}`;
mongoose.connect(connectionStr, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//ROUTES
app.use('/api/programs', programRouter);
app.use('/api/users', userRouter);
app.use('/api/logs', logRouter);
app.use('/api/parents', parentRouter);
app.use('/api/students', studentRouter);
app.use('/api/videos', videoRouter);

app.get('/', (req, res) => {
	res.send('Distance Learning API');
});

app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});
