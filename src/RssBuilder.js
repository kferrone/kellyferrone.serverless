const xmlbuilder = require('xmlbuilder');

module.exports = class RssBuilder {

	constructor() {
		this.finished = false;
		this.rss = xmlbuilder.create({
            rss: {
				'@version': '2.0'
			}
        }).ele('channel');
	}

	setMeta(meta) {
		if (this.finished) return;
		this.rss.ele(meta);
	}

	add(post) {
		if (this.finished) return;
		this.rss.ele({
			item: post
		});
	}

	finish(pretty = false) {
        this.finished = true;
        return this.rss.end({ pretty });
    }

}