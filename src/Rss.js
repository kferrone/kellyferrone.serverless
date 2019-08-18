const RssBuilder = require('./RssBuilder');
const excerptHtml = require('excerpt-html');

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
		pubDate: post.published,
		author: post.author.displayName,
		category: ''
	}
}

function metaToRssMeta(meta) {
	return {
		title: meta.name,
		description: meta.description,
		link: '',
		lastBuildDate: meta.updated,
		pubDate: meta.published,
		ttl: 60,
		copyright: '',
		language: meta.locale.language,
		generator: 'Google Cloud Function'
	}
}

exports.buildRss = function(meta = null, posts = Array, pretty = false) {
	let rssBuilder = new RssBuilder();

	if (meta !== null) rssBuilder.setMeta(metaToRssMeta(meta));

	posts.forEach((post) => {
		rssBuilder.add(postToRssItem(post));
	});
	return rssBuilder.finish(pretty);
}