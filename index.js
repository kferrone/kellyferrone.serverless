
const SendGridAPI = require('./src/SendGridAPI');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sitemapFx = require('./src/SitemapFx');
const cors = require('cors');
const config  = functions.config().app;
const blogger = require('./src/Blogger');
const rssFx = require('./src/RssFx');

admin.initializeApp(functions.config().firebase);

function errorHandler(res) {
	return e => {
		console.error('There was an error',e);
		res.status(500).send(e);
		return Promise.reject(e);
	}
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase! The email in the config is " + config.sendgrid.email);
});

/**
 * Get the RSS.xml
 */
exports.rssFeed = functions.https.onRequest((req,res) => {
	const client = blogger.getClient(config.blogger.blogid,config.blogger.key);
	rssFx.getRss(client)
	.then(rssFile => {
		res
			.set('content-type', 'application/rss+xml; charset=UTF-8')
			.status(200)
			.send(rssFile);
	})
	.catch(errorHandler(res));
});

/**
 * Get the Atom.xml
 */
exports.atomFeed = functions.https.onRequest((req,res) => {
	const client = blogger.getClient(config.blogger.blogid,config.blogger.key);
	require('./src/AtomFx')
		.getAtom(client)
		.then(atomFile => {
			res
				.set('content-type', 'application/atom+xml; charset=UTF-8')
				.status(200)
				.send(atomFile);
		})
		.catch(errorHandler(res));
});

/**
 * Get the sitemap.xml
 */
exports.siteMap = functions.https.onRequest((req, res) => {
	const client = blogger.getClient(config.blogger.blogid,config.blogger.key);
	sitemapFx.getSitemap(client,config)
	.then(siteMap => {
		//send off the sitemap to the requestor
		res
			.set('content-type', 'application/atom+xml; charset=UTF-8')
			.status(200)
			.send(siteMap);
	})
	.catch(errorHandler(res));
});

/**
 * Send an email
 */
exports.sendgridEmail = functions.https.onRequest((req, res) => {
    var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridEmailFn(req,res);
    });
});

/**
 * Handle sendgrids webhook
 */
exports.sendgridWebhook = functions.https.onRequest((req, res) => {
    var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridWebhook(req,res);
    });
});

exports.blogFx = functions.https.onRequest(require('./src/BloggerFx').app);