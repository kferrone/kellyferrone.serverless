const AtomBuilder = require('./AtomBuilder');
const excerptHtml = require('excerpt-html');

function postToAtomEntry(post) {
	//let exerpt = '';
	let exerpt = excerptHtml(post.content, {
		moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
		stripTags:   true, // Set to false to get html code
		pruneLength: 140, // Amount of characters that the excerpt should contain
		pruneString: '...', // Character that will be added to the pruned string
		pruneSeparator: ' ', // Separator to be used to separate words
	});
	
	return {
		id: '',
		title: {
			'@type': 'html',
			'#text': post.title
		},
		summary: {
			'@type': 'html',
			'#text': exerpt
		},
		content: {
			'@type': 'html',
			'#text': post.content
		},
		link: {
			'@href': '',
			'@rel': 'alternate',
			'@type': 'text/html',
			'@title': post.title
		},
		updated: post.updated,
		published: post.published,
		author: {
			name: post.author.displayName
		},
		category: ''
	}
}

function metaToAtomMeta(meta) {
	return {
		id: '',
		title: {
			'@type': 'html',
			'#text': meta.name
		},
		subtitle: meta.description,
		updated: meta.updated,
		generator: {
			'@uri': '',
			'@version': '',
			'#text': 'Google Cloud Function'
		},
		author: {
			name: '',
			email: '',
			uri: ''
		}
	}
}

function buildAtom(meta = null, posts = Array, pretty = false) {
	let atomBuilder = new AtomBuilder();

	if (meta !== null) rssBuilder.setMeta(metaToAtomMeta(meta));

	posts.forEach((post) => {
		atomBuilder.add(postToAtomEntry(post));
	});
	return atomBuilder.finish(pretty);
}