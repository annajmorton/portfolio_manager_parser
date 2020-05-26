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

var inputxml = 'pm_api/template_xml/fake_customers/customer_1.xml';

console.log(inputxml);

fs.readFile(inputxml, 'utf8',function(err,data){
    console.log(err);
    console.log(data);
    var jsonObj = PMp.xml2j(data);
    var j2x = PMp.j2xml();
    var rmethod = 'POST';
    
    // run this code if account is already created
    // account info will update
    // you need an account id to access the site
    if(false){
        jsonObj['id'] = config.dev.pm_api_account_id;
        rmethod = 'PUT';
        
    }

    var send_xml = j2x.parse(jsonObj);
    var request_options = {
        method: rmethod,
        url: pm_url_base + "/account",
        headers:{
            'Content-Type':'application/xml'
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



