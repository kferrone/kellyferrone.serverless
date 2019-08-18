const xmlbuilder = require('xmlbuilder');

const xmlns = 'http://www.w3.org/2005/Atom';

module.exports = class RssBuilder {

	constructor() {
		this.finished = false;
        this.atom = xmlbuilder.create({
            feed: {
                '@xmlns': xmlns
            }
        });
	}

	setMeta(meta) {
		if (this.finished) return;
		this.atom.ele(meta);
	}

	add(entry) {
		if (this.finished) return;
		this.atom.ele({
			entry
		});
	}

	finish(pretty = false) {
        this.finished = true;
        return this.atom.end({ pretty });
    }

}