const SitemapBuilder = require('./SitemapBuilder');
const urlSlug = require('url-slug');

/**
 * Pass in a list of URL objects and a sitemap will be made. 
 * @param listOfURL A json representation of the url object in a sitemap. 
 * @param pretty True if you want the XML to be in pretty format. 
 */
function buildSitemap(listOfURL = Array,pretty = false) {
	let sitemapBuilder = new SitemapBuilder();
    listOfURL.forEach((url) => {
        sitemapBuilder.add(url.loc,url.lastMod);
    });
    return sitemapBuilder.finish(pretty);
}

/**
 * Builds a sitemap for the front end based on bloggers pages and posts.
 * The extra views which are not a page or post are appended as well. 
 * @param req The request object from some client.
 * @param res The response object to send back to the client.
 */
exports.getSitemap = function(db,host) {
    return Promise.resolve()
        .then(() => {

            //make sure the request only returns the title and date updated, it's all we need
            var params = ['title','updated'];

            //we need the pages and posts, no particular order is needed
            return Promise.all([
                db.collection('pages').select(...params).get(),
                db.collection('posts').select(...params).get()
            ]);
        })
        .then(([pages,posts]) => {

            //these are the static views which will always be present
            var listOfURL = [
                {loc: `${host}/`},
                {loc: `${host}/#/contact`},
                {loc: `${host}/#/blog`}
            ];

            //make a list of URLs for the pages
            pages.forEach((pageRef) => {
                const page = pageRef.data();
                listOfURL.push({
                    loc: `${host}/#/${urlSlug(page.title)}`,
                    lastMod: page.updated.toDate().toISOString()
                });
            });

            posts.forEach((postRef) => {
                const post = postRef.data();
                listOfURL.push({
                    loc: `${host}/#/posts/${urlSlug(post.title)}`,
                    lastMod: post.updated.toDate().toISOString()
                });
            });

            //finally add all of the URLs to the actual sitemap XML
            let siteMap = buildSitemap(listOfURL,true);

            return Promise.resolve(siteMap);
        });
};