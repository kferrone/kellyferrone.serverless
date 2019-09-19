const express = require("express");
const app = express();
const blogger = require('./Blogger');
const excerptHtml = require('excerpt-html');
const urlSlug = require('url-slug');

let client = null;
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

app.get("/blogs/:blogID", (req, res) => {
	console.log('The id is ' + req.params.blogID);
	db.collection('blogs')
		.doc(req.params.blogID)
		.get()
		.then(doc => {
			if (!doc.exists) {
				res
					.set('content-type', 'application/json')
					.status(404)
					.send({
						code: 404,
						message: "The specified blog does not exist"
					});
			} else {
				console.log('Document data:', doc.data());
				res
					.set('content-type', 'application/json')
					.status(200)
					.send(doc.data());
			}
		})
		.catch(err => {
			console.log('Error getting document', err);
		});
});

app.get("/blogs/:blogID/pages", (req, res) => {
	// .where('blog', '==', db.collection('blogs').doc(req.params.blogID))
	const blogID = req.params.blogID;
	db.collection('blogs')
		.doc(blogID)
		.collection('posts')
		.where('kind', '==', 'page')
		.get()
		.then(snapshot => {
			const results = [];
			snapshot.forEach(postRef => {
				let post = postRef.data();

				post.id = postRef.id;

				post.slug = urlSlug(post.title);

				post.blog = {
					id: blogID
				}

				results.push(post);
			});
			res
				.set('content-type', 'application/json')
				.status(200)
				.send(results);
		})
		.catch(errorHandler(res));
});

app.get("/blogs/:blogID/posts", (req, res) => {
	const blogID = req.params.blogID;
	db.collection('blogs')
		.doc(blogID)
		.collection('posts')
		.where('kind', '==', 'post')
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

				post.blog = {
					id: blogID
				}

				results.push(post);
			});
			res
				.set('content-type', 'application/json')
				.status(200)
				.send(results);
		})
		.catch(errorHandler(res));
});

app.get("/blogs/post/:postID/comments", function getMeta(req, res) {
	client.getPostComments(req.params.postID).then(comments => {
		res
			.set('content-type', 'application/json')
			.status(200)
			.send(comments.data);
	})
		.catch(errorHandler(res));
});

exports.getApp = function (configuration, database) {
	client = blogger.getClient(configuration.blogger.blogid, configuration.blogger.key);
	db = database;
	config = configuration;
	return app;
};