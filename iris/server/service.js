'use strict';

const express = require('express');
const service = express();  
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();

service.set('serviceRegistry', serviceRegistry);

service.put('/service/:intent/:port', (req, res, next) => {
    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;

    console.log(req.connection.remoteAddress);
    var serviceIp = req.connection.remoteAddress;
    if (serviceIp.includes('::')) {
    	serviceIp = serviceIp.replace(/^.*:/, '');
    } 

    serviceRegistry.add(serviceIntent, serviceIp, servicePort);
    res.json({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` });
});

module.exports = service;