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

	add(item) {
		if (this.finished) return;
		this.rss.ele({
			item
		});
	}

	finish(pretty = false) {
        this.finished = true;
        return this.rss.end({ pretty });
    }

}