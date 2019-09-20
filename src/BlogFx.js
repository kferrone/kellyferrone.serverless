const express = require("express");
const app = express();
const excerptHtml = require('excerpt-html');
const urlSlug = require('url-slug');

let db = null;
let config = null;

// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

function errorHandler(res) {
	return e => {
		console.error('There was an error', e);
		res.status(500).send(e);
		return Promise.reject(e);
	}
}

app.get("/blog/pages", (req, res) => {
	db.collection('pages')
		.get()
		.then(snapshot => {
			const results = [];
			snapshot.forEach(postRef => {
				let post = postRef.data();

				post.id = postRef.id;

				post.slug = urlSlug(post.title);

				results.push(post);
			});
			res
				.set('content-type', 'application/json')
				.status(200)
				.send(results);
		})
		.catch(errorHandler(res));
});

app.get("/blog/posts", (req, res) => {
	db.collection('posts')
		.get()
		.then(snapshot => {
			const results = [];
			snapshot.forEach(postRef => {
				let post = postRef.data();
				console.log('The post id is ', post);

				post.id = postRef.id;

				post.exerpt = excerptHtml(post.content, {
					moreRegExp: /\s*<!--\s*more\s*-->/i,  // Search for the slug
					stripTags: true, // Set to false to get html code
					pruneLength: 140, // Amount of characters that the excerpt should contain
					pruneString: '...', // Character that will be added to the pruned string
					pruneSeparator: ' ', // Separator to be used to separate words
				});

				post.slug = urlSlug(post.title);

				results.push(post);
			});
			res
				.set('content-type', 'application/json')
				.status(200)
				.send(results);
		})
		.catch(errorHandler(res));
});

app.get("/blog/posts/:postID/comments", function getMeta(req, res) {
	db.collection('posts')
		.doc(req.params.postID)
		.collection('comments')
		.get()
		.then((snapshot) => {
			const results = [];
			snapshot.forEach(commentRef => {
				results.push(commentRef.data());
			});
		})
		.catch(errorHandler(res));
});

exports.getApp = function (configuration, database) {
	db = database;
	config = configuration;
	return app;
};