var BloggerAPI = require('./BloggerAPI');

exports.getClient = function(id,key) {
    return new BloggerAPI(id,key);
}