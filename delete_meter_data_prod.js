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

// meter id to delete
var meter_ids = [79317534,79317535,79317536,79317483,79317482,79317526,79317468,79317525,79317472,79317474,79317473,79317469];

var rmethod = 'DELETE';

meter_ids.forEach(function(meter_id){
    // resource
    var resource_url = '/meter/' + meter_id + '/consumptionData'; 


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
