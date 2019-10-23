exports.logError = (err, req, res, next) => {
	console.error('There was an error', e);
	res.status(500).send(e);
};