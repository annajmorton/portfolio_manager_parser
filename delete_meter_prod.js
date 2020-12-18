// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';

const rp = require('request-promise');
var config = require('./config.js');

// env var
var env = config[config.env];
var pm_url_base = config.production.pm_api_uri;
let propJson = require('./property.json');

// meter id to delete
var meter_ids = propJson.meters_other; 
var rmethod = 'DELETE';

meter_ids.forEach(function(meter_id){
    // resource
    var resource_url = '/meter/' + meter_id; 


    var request_options = {
        method: rmethod,
        url: pm_url_base + resource_url,
        headers:{
            'Content-Type':'application/xml',
            'Authorization': 'Basic ' + Buffer.from(env.pm_api_username + ':' + env.pm_api_password).toString('base64')
        },
        body: ''
    };

    rp(request_options)
        .then(function(parsedBody){
            console.log(parsedBody);
        })
        .catch(function(err){
            console.log(err);
        });


});
