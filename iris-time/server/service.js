'use strict'; // ES6 strict mode

const express = require('express');
const service = express();
const request = require('superagent');

const googleToken = require('./apiKeys').get('google-api-key');

service.get('/service/:location', (req, res, next) => {
	request.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=${googleToken}`,
		(err, response) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			res.json(response.body.results[0].geometry.location);
		}
	);

});

module.exports = service;