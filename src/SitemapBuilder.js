const xmlbuilder = require('xmlbuilder');

const xmlns_xsi = 'http://www.w3.org/2001/XMLSchema-instance';
const xsi_schemaLocation = 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd';
const xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
module.exports = class SitemapBuilder {
    constructor() {
        this.finished = false;
        this.sitemap = xmlbuilder.create({
            urlset: {
                '@xmlns:xsi': xmlns_xsi,
                '@xsi:schemaLocation': xsi_schemaLocation,
                '@xmlns': xmlns
            }
        });
    }

    add(loc, lastmod = null) {
        if (this.finished) return;
        this.sitemap.ele({
            url: {
                loc,
                lastmod
            }
        });
    }

    finish(pretty = false) {
        this.finished = true;
        return this.sitemap.end({ pretty });
    }

}