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

// resource specific
var resource_url = '/property/17442524/meter/list';
var rmethod = 'GET';


var request_options = {
    method: rmethod,
    url: pm_url_base + resource_url,
    headers:{
        'Content-Type':'application/xml',
        'Authorization': 'Basic ' + Buffer.from('acme_dx_user_1'+ ':' + 'PA$sw0r6').toString('base64')
    },
    body:''
   
};

rp(request_options)
    .then(function(parsedBody){
        console.log(parsedBody);
    })
    .catch(function(err){
        console.log(err);
    });




