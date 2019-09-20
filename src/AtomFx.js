const AtomBuilder = require('./AtomBuilder');
const excerptHtml = require('excerpt-html');
const {getTemplate} = require('./RemoteConfig');
const urlSlug = require('url-slug');

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
		updated: post.updated.toDate().toISOString(),
		published: post.published.toDate().toISOString(),
		author: {
			name: 'Kelly Ferrone'
		},
		category: ''
	}
}

function metaToAtomMeta(meta) {
	return {
		id: '',
		title: {
			'@type': 'html',
			'#text': meta.title
		},
		subtitle: meta.message,
		updated: meta.updated,
		generator: {
			'@uri': 'https://firebase.google.com/',
			'@version': 'v1',
			'#text': 'Google Cloud Function'
		},
		author: {
			name: 'Kelly Ferrone',
			email: 'info@kellyferrone.com',
			uri: 'https://kellyferrone.com'
		}
	}
}

function buildAtom(meta = null, posts = Array, host = '', pretty = false) {
	let atomBuilder = new AtomBuilder();

	if (meta !== null) atomBuilder.setMeta(metaToAtomMeta(meta));

	posts.forEach((postRef) => {
		atomBuilder.add(postToAtomEntry(postRef.data()));
	});
	return atomBuilder.finish(pretty);
}

exports.getAtom = function(db, config, host) {
	return Promise.resolve()
		.then(() => {
			return Promise.all([
				getTemplate(config),
                db.collection('posts').get()
			]);
		})
		.then(([meta,posts]) => {

			//get the atom file
			const atomFile = buildAtom(meta,posts, host, true);

			return Promise.resolve(atomFile);
		});
}