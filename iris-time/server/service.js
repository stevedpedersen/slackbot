'use strict'; // ES6 strict mode

const express = require('express');
const service = express();

// for every req to service, we assume the next param is the location
service.get('/service/:location', (req, res, next) => {
	res.json({ result: req.params.location });
});

module.exports = service;