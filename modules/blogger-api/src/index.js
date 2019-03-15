var BloggerAPI = require('./BloggerAPI');
var SitemapBuilder = require('./SitemapBuilder');

exports.getClient = function(id,key) {
    return new BloggerAPI(id,key);
}

exports.buildSitemap = function(listOfURL = Array,pretty = false) {
    let builder = new SitemapBuilder();
    for (url in listOfURL) {
        builder.add(url.loc,url.lastMod);
    }
    return builder.finish(pretty);
}