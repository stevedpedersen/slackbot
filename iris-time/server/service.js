'use strict'; // ES6 strict mode

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const geoToken = require('./apiKeys').get('google-geo-api-key');
const timeToken = require('./apiKeys').get('google-timezone-api-key');

// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY

service.get('/service/:location', (req, res, next) => {
	request.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=${geoToken}`,
		(err, response) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			const location = response.body.results[0].geometry.location;
			const timestamp = +moment().format('X');

			request.get(
				`https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${timeToken}`,
				(err, response) => {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					}

					const result = response.body;
					const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

					res.writeHead(200, {'Content-Type': 'text/html'});

					res.end(`
						<!DOCTYPE html>
						<html>
							<head>
								<title>Time in ${req.params.location}</title>	
							</head>
							<body>
								<h1>Time in ${req.params.location}</h1>
								<p>${timeString}</p>
							</body>
						</html>
					`);
				}
			);
		}
	);

});

module.exports = service;