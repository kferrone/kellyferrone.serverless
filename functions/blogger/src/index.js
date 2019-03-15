var BloggerAPI = require('./BloggerAPI');
var SitemapBuilder = require('./SitemapBuilder');

var _this = this;

exports.getClient = function(id,key) {
    return new BloggerAPI(id,key);
}

/**
 * Pass in a list of URL objects and a sitemap will be made. 
 * @param listOfURL A json representation of the url object in a sitemap. 
 * @param pretty True if you want the XML to be in pretty format. 
 */
exports.buildSitemap = function(listOfURL = Array,pretty = false) {
    let builder = new SitemapBuilder();
    listOfURL.forEach((url) => {
        builder.add(url.loc,url.lastMod);
    });
    return builder.finish(pretty);
}

/**
 * Builds the list of URL needed for a sitemap.
 * @param blogItems A list of items from blogger. i.e. pages or posts
 * @param host The base hostname of the website.
 */
exports.buildUrls = function(blogItems, host) {
    let listOfURL = new Array();
    blogItems.forEach((item) => {
        let title = _this.sanitizeTitle(item.title);
        listOfURL.push({
            loc: `${host}/${title}`,
            lastMod: item.updated
        });
    });
    return listOfURL;
}

/**
 * Takes a nice human readable title and replaces spaces with underscores and lowercases it. 
 * @param title Some title in human readable form. 
 */
exports.sanitizeTitle = function(title) {
    return title.toLowerCase().split(' ').join('_');
}