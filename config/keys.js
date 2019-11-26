module.exports = {
	mongoURI: `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0-${process.env
		.CLUSTNAME}.mongodb.net/test?retryWrites=true&w=majority`,
	secretOrKey: 'secret'
};


