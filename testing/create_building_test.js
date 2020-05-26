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
var resource_url = '/property/17442524/building';
var inputxml = "pm_api/template_xml/building.xml";
var rmethod = 'POST';

fs.readFile(inputxml, 'utf8',function(err,data){
    var jsonObj = PMp.xml2j(data);
    var j2x = PMp.j2xml();

//  edit json object   
//    jsonObj['account']['username'] = config.dev.pm_api_username;

    var send_xml = j2x.parse(jsonObj);
    var request_options = {
        method: rmethod,
        url: pm_url_base + resource_url,
        headers:{
            'Content-Type':'application/xml',
            'Authorization': 'Basic ' + Buffer.from('acme_dx_user_1'+ ':' + 'PA$sw0r6').toString('base64')
        },
        body:send_xml
       
    };
    
    rp(request_options)
        .then(function(parsedBody){
            console.log(parsedBody);
        })
        .catch(function(err){
            console.log(err);
        });

});



