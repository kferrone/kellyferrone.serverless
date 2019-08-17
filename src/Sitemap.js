const blogger = require('./Blogger');
const SitemapBuilder = require('./SitemapBuilder');
const functions = require('firebase-functions');
const config  = functions.config();

var _this = this;

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
 * Builds the list of URL needed for a sitemap.
 * @param blogItems A list of items from blogger. i.e. pages or posts
 * @param host The base hostname of the website.
 */
function buildUrls(blogItems, host) {
    let listOfURL = new Array();
    blogItems.forEach((item) => {
        let title = sanitizeTitle(item.title);
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
function sanitizeTitle(title) {
    return title.toLowerCase().split(' ').join('_');
}

/**
 * Builds a sitemap for the front end based on bloggers pages and posts.
 * The extra views which are not a page or post are appended as well. 
 * @param req The request object from some client.
 * @param res The response object to send back to the client.
 */
exports.getSitemap = (req, res) => {
    return Promise.resolve()
        .then(() => {
			//get the blogger client so we can make some requests
            const client = blogger.getClient(config.blogger.blogid,config.blogger.key);

            //make sure the request only returns the title and date updated, it's all we need
            var params = {
                fields: 'kind,items(title,updated)',
                status: 'live'
            };

            //we need the pages and posts, no particular order is needed
            return Promise.all([
                client.getPages(params),
                client.getPosts(params)
            ]);
        })
        .then((values) => {
            //the hostname to prefix each page and post with
            const host = config.host;
            const BLOGGER_POSTLIST = 'blogger#postList';
            const BLOGGER_PAGELIST = 'blogger#pageList';

            //these are the static views which will always be present
            var listOfURL = [
                {loc: `${host}/`},
                {loc: `${host}/#/contact`},
                {loc: `${host}/#/blog`}
            ];

            //make a list of URLs from the promised pages and posts
            values.forEach(({data}) => {
                let path = (data.kind == BLOGGER_POSTLIST) ? `#/post` : '#';
                let listOfItems = buildUrls(data.items,`${host}/${path}`);
                listOfURL = listOfURL.concat(listOfItems);
            });

            //finally add all of the URLs to the actual sitemap XML
            let siteMap = buildSitemap(listOfURL,false);

            //send off the sitemap to the requestor
            res
                .set('content-type', 'application/atom+xml; charset=UTF-8')
                .status(200)
                .send(siteMap);
        })
        .catch((e) => {
			console.error('There was an error',e);
			res.status(500).send(e);
            return Promise.reject(e);
        });
};