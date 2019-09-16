const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config  = functions.config();

let app = null;

// load with the service account when on local or some other server
if ( typeof config.firebase !== 'undefined' || 'firebase' in config) {
	app = admin.initializeApp(config.firebase);
} 
// load from firebase when the firebase config is available, i.e. running on firebase itself
else if ( typeof config.firebase === 'undefined' && 'service_account' in config ) {
	app = admin.initializeApp({ 
		credential: admin.credential.cert(config.service_account)
	});
} 
// if the other two don't work out, try the default
else {
	app = admin.initializeApp({
		credential: admin.credential.applicationDefault()
	});
}

exports.db = app.firestore();

exports.functions = functions;

exports.config = config;