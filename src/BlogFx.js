const express = require("express");
const {validateFirebaseIdToken} = require("./middle/FirebaseValidator");
const {logError} = require("./error/Basics");

exports.getApp = function (config, db) {
	const app = express();

	// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
	app.disable("x-powered-by");

	app.post("*", validateFirebaseIdToken);
	require("./routes/Pages")(app, db, config);
	require("./routes/Posts")(app, db, config);

	app.use(logError);

	return app;
};