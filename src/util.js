
exports.exerpt = function(content) {
	
}

/**
 * Takes a nice human readable title and replaces spaces with underscores and lowercases it. 
 * @param title Some title in human readable form. 
 */
exports.sanitizeTitle = function(title) {
    return title.toLowerCase().split(' ').join('_');
}