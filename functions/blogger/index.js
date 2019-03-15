const api = require('../src');

/**
 * Builds a sitemap for the front end based on bloggers pages and posts.
 * The extra views which are not a page or post are appended as well. 
 * @param req The request object from some client.
 * @param res The response object to send back to the client.
 */
exports.siteMapper = (req, res) => {
    return Promise.resolve()
        .then(() => {
            const blogger = api.getClient(process.env.BLOGGER_BLOG_ID,process.env.BLOGGER_API_KEY);
            var params = {
                fields: 'kind,items(title,updated)',
                status: 'live'
            };
            return Promise.all([
                blogger.getPages(params),
                blogger.getPosts(params)
            ]);
        })
        .then((values) => {
            const host = process.env.host;
            const BLOGGER_POSTLIST = 'blogger#postList';
            const BLOGGER_PAGELIST = 'blogger#pageList';
            var listOfURL = [
                {loc: `${host}/`},
                {loc: `${host}/contact`},
                {loc: `${host}/blog`}
            ];
            values.forEach(({data}) => {
                let path = (data.kind == BLOGGER_POSTLIST) ? `#/posts` : '#';
                let listOfItems = api.buildUrls(data.items,`${host}/${path}`);
                listOfURL = listOfURL.concat(listOfItems);
            });
            let siteMap = api.buildSitemap(listOfURL,true);
            res
                .set('content-type', 'application/atom+xml; charset=UTF-8')
                .status(200)
                .send(siteMap);
        })
        .catch((e) => {
            res.status(500).send(e);
            return Promise.reject(e);
        });
};