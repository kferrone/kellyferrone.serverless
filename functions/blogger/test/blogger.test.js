const api = require('../src');
const blogger = api.getClient(process.env.BLOGGER_BLOG_ID,process.env.BLOGGER_API_KEY);

const host = 'https://www.example.com';
const BLOGGER_POSTLIST = 'blogger#postList';
const BLOGGER_PAGELIST = 'blogger#pageList';
var listOfURL = [
    {loc: `${host}/#/`},
    {loc: `${host}/#/contact`},
    {loc: `${host}/#/blog`}
];

var params = {
    fields: 'kind,items(title,updated)',
    status: 'live'
};
Promise.all([
    blogger.getPages(params),
    blogger.getPosts(params)
]).then((values) => {
    values.forEach(({data}) => {
        let path = (data.kind == BLOGGER_POSTLIST) ? `#/posts` : '#';
        let listOfItems = api.buildUrls(data.items,`${host}/${path}`);
        listOfURL = listOfURL.concat(listOfItems);
    });
    console.log(api.buildSitemap(listOfURL,true));
}).catch((e) => {
    console.log('Uh oh, there was an error',e);
});