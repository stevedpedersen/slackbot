var fs = require('fs');
var path = require('path');

module.exports.init = function getApiKey(fileName) {
	var file = path.join(__dirname, fileName);
	try {
		var stats = fs.statSync(file);	// TODO: error handler
	} catch (err) {
		console.log(err);
	}
	
	var api = { key: '' };
	if (stats && stats.isFile()) {
		try {
			api.key = fs.readFileSync(file, 'UTF-8');
		} catch (err) {
			console.log(err);
		}		
	}
	return api.key;
}
