
const SendGridAPI = require('./src/SendGridAPI');
const functions = require('firebase-functions');
const Sitemap = require('./src/Sitemap');
const cors = require('cors');
const config  = functions.config().app;
const blogger = require('./src/Blogger');
const rss = require('./src/Rss');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase! The email in the config is " + config.sendgrid.email);
});

/**
 * Get the RSS.xml
 */
exports.rssFeed = functions.https.onRequest((req,res) => {
	const client = blogger.getClient(config.blogger.blogid,config.blogger.key);

	Promise.all([
		client.getBlog(),
		client.getPosts()
	])
	.then((values) => {

		//get the blog meta and posts from the promised values
		let posts;
		let blog;
		values.forEach(({data}) => {
			switch(data.kind) {
				case 'blogger#postList':
					posts = data.items;
					break;
				case 'blogger#blog':
					blog = data;
					break;
			}
		});

		//get the rss file
		let rssFile = rss.buildRss(blog,posts, true);

		//send the rss file to the client
		res
			.set('content-type', 'application/rss+xml; charset=UTF-8')
			.status(200)
			.send(rssFile);
	})
	.catch((e) => {
		console.error('There was an error',e);
		res.status(500).send(e);
		return Promise.reject(e);
	});
});

/**
 * Get the sitemap.xml
 */
exports.siteMap = functions.https.onRequest((req, res) => {
    console.log('Making the sitemap');
    var corsFn = cors();
    corsFn(req, res, function() {
		Sitemap.getSitemap(req,res);
    });
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
