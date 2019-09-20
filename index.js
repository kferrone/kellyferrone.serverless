
const { functions, db, config } = require('./src/Firebase');
const cors = require('cors');

function errorHandler(res) {
	return e => {
		//console.error('There was an error',e);
		res.status(500).send(e);
		return Promise.reject(e);
	}
}

function getHost(req) {
	let host = null;
	if (process.env.HOST) {
		host = process.env.HOST;
	} else if (typeof req.headers['x-forwarded-host'] !== 'undefined') {
		host = req.headers['x-forwarded-host'];
	} else {
		host = req.headers.host;
	}
	return host;
}

exports.helloWorld = functions.https.onRequest((req, res) => {
	res.send('hello world');
});

exports.metaFx = functions.https.onRequest((req,res) => {
	const {getTemplate} = require('./src/RemoteConfig');
	getTemplate(config,req.query.option)
		.then((appConfig) => {
			res
				.set('content-type', 'application/json')
				.status(200)
				.send(appConfig);
		})
		.catch(errorHandler(res));
});

/**
 * Get the RSS.xml
 */
exports.rssFeed = functions.https.onRequest((req,res) => {
	const rssFx = require('./src/RssFx');
	rssFx.getRss(db, config, getHost(req))
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
	require('./src/AtomFx')
		.getAtom(db, config, getHost(req))
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
	const sitemapFx = require('./src/SitemapFx');
	sitemapFx.getSitemap(db,getHost(req))
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
	const SendGridAPI = require('./src/SendGridAPI');
	var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridEmailFn(req,res);
    });
});

/**
 * Handle sendgrids webhook
 */
exports.sendgridWebhook = functions.https.onRequest((req, res) => {
	const SendGridAPI = require('./src/SendGridAPI');
	var corsFn = cors();
    corsFn(req, res, function() {
        SendGridAPI.sendgridWebhook(req,res);
    });
});

/**
 * Handles all the blog content
 */
exports.blogFx = functions.https.onRequest(require('./src/BlogFx').getApp(config.app, db));