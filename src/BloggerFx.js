const express = require("express");
const app = express();
const blogger = require('./Blogger');
const excerptHtml = require('excerpt-html');

var client = null;

// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

function errorHandler(res) {
	return e => {
		console.error('There was an error', e);
		res.status(500).send(e);
		return Promise.reject(e);
	}
}

app.get("/blog/meta", function getMeta(req, res) {
	client.getBlog().then(blog => {
		res
			.set('content-type', 'application/json')
			.status(200)
			.send(blog.data);
	})
	.catch(errorHandler(res));
});

app.get("/blog/pages", function getMeta(req, res) {
	client.getPages().then(pages => {
		res
			.set('content-type', 'application/json')
			.status(200)
			.send(pages.data);
	})
	.catch(errorHandler(res));
});

app.get("/blog/posts", function getMeta(req, res) {
	client.getPosts().then(posts => {
		
		posts.data.items.forEach(post => {
			post.exerpt = excerptHtml(post.content, {
				moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
				stripTags:   true, // Set to false to get html code
				pruneLength: 140, // Amount of characters that the excerpt should contain
				pruneString: '...', // Character that will be added to the pruned string
				pruneSeparator: ' ', // Separator to be used to separate words
			});
		});
		
		res
			.set('content-type', 'application/json')
			.status(200)
			.send(posts.data);
	})
	.catch(errorHandler(res));
});

exports.getApp = function (config) {
	client = blogger.getClient(config.blogger.blogid, config.blogger.key);
	return app;
};