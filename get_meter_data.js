// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';

// [START gae_flex_quickstart]
const rp = require('request-promise');
const fs = require('fs');

var config = require('./config.js');
var PM_parser = require('./lib/pm_Jxml_parser.js');
var PMp = new PM_parser;
var pm_url_base = config.dev.pm_api_uri;

// env var
var env = config[config.env];

//resource info
var meters = env.shared[0].properties[0].meters;
var rmethod = 'GET';
var resource_url = '/meter/' + meters[0].id +'/consumptionData';


//  edit json object   
//    jsonObj['account']['username'] = config.dev.pm_api_username;


var request_options = {
    method: rmethod,
    url: pm_url_base + resource_url,
    headers:{
        'Content-Type':'application/xml',
        'Authorization': 'Basic ' + Buffer.from(env.pm_api_username + ':' + env.pm_api_password).toString('base64')
    }
};

rp(request_options)
    .then(function(parsedBody){
        console.log(parsedBody);
    })
    .catch(function(err){
        console.log(err);
    });

