var api = require('../src');

var listOfURL = [
    {
        loc: 'https://kellyferrone.com/'
    },
    {
        loc: 'https://kellyferrone.com/blog',
        lastMod: 'yesterday'
    }
];

console.log(api.buildSitemap(listOfURL,true));