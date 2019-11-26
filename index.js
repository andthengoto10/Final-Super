require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const router = require('./routers/router');
const bodyParser = require('body-parser');
const cors = require('cors');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

// bodyParser middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;
// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('MongoDB successfully connected'))
	.catch((err) => console.log(err));

// app.use(express.static('public'));
// app.use(cors());
app.use('/', router);

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on port: ${PORT}`);
});
