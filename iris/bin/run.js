'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const slackApi = require('../server/slackApi');
const slackToken = slackApi.init('iris-api-key.txt');
const slackLogLevel = 'verbose';

if (slackToken) {
	const rtm = slackClient.init(slackToken, slackLogLevel);
	rtm.start();

	// when connected to Slack we call server.listen
	slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

	server.on('listening', function() {
	    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
	});
} else {
	console.log('Could not locate the Slack API key.');
}
