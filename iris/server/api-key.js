var fs = require('fs');
var path = require('path');

var api = { key: '' };
var fileName = 'iris-api-key.txt';
var file = path.join(__dirname, fileName);
var stats = fs.statSync(file);

if (stats.isFile()) {
	api.key = fs.readFileSync(file, 'UTF-8');
}

module.exports = api; 