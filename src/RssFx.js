const RssBuilder = require('./RssBuilder');
const excerptHtml = require('excerpt-html');
const {getTemplate} = require('./RemoteConfig');
const urlSlug = require('url-slug');

function postToRssItem(post) {
	//let exerpt = '';
	let exerpt = excerptHtml(post.content, {
		moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
		stripTags:   true, // Set to false to get html code
		pruneLength: 140, // Amount of characters that the excerpt should contain
		pruneString: '...', // Character that will be added to the pruned string
		pruneSeparator: ' ', // Separator to be used to separate words
	});
	
	return {
		title: post.title,
		description: exerpt,
		link: '',
		guid: '',
		pubDate: post.published.toDate().toISOString(),
		author: 'Kelly Ferrone',
		category: ''
	}
}

function metaToRssMeta(meta) {
	return {
		title: meta.title,
		description: meta.message,
		link: '',
		lastBuildDate: meta.updated,
		pubDate: meta.published,
		ttl: 60,
		copyright: '',
		language: 'en',
		generator: 'Google Cloud Function'
	}
}

function buildRss(meta = null, posts = Array, host = '', pretty = false) {
	let rssBuilder = new RssBuilder();

	if (meta !== null) rssBuilder.setMeta(metaToRssMeta(meta));

	posts.forEach((postRef) => {
		rssBuilder.add(postToRssItem(postRef.data()));
	});
	return rssBuilder.finish(pretty);
}

exports.getRss = function(db, config, host) {
	return Promise.resolve()
		.then(() => {
			return Promise.all([
				getTemplate(config),
                db.collection('posts').get()
			]);
		})
		.then(([meta,posts]) => {

			//get the rss file
			let rssFile = buildRss(meta, posts, host, true);

			return Promise.resolve(rssFile);
		});
}