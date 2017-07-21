'use strict'; // ES6 strict mode

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');
const keyFinder = require('../api-keys/keyFinder');

const geoToken = keyFinder.get('google-geo-api-key');
const timeToken = keyFinder.get('google-timezone-api-key');

service.get('/service/:location', (req, res, next) => {
	const geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
	
	request.get(`${geoUrl}${req.params.location}&key=${geoToken}`, (err, response) => {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}

		const location = response.body.results[0].geometry.location;
		const timestamp = +moment().format('X');
		const timezoneUrl = 'https://maps.googleapis.com/maps/api/timezone/json?location='

		request.get(
			`${timezoneUrl}${location.lat},${location.lng}&timestamp=${timestamp}&key=${timeToken}`,
			(err, response) => {
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				}

				const result = response.body;
				const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset)
					.utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

				res.json({ result: timeString });
			}
		);
	});
});

module.exports = service;