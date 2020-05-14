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



fs.readFile('./pm_api/template_xml/account_info.xml', 'utf8',function(err,data){
    var jsonObj = PMp.xml2j(data);
    var j2x = PMp.j2xml();
    var rmethod = 'POST';
    
    jsonObj['account']['username'] = config.dev.pm_api_username;
    jsonObj['account']['password'] = config.dev.pm_api_password;
    jsonObj['account']['contact']['email'] = config.dev.pm_api_email;
    jsonObj['account']['contact']['phone'] = config.dev.pm_api_phone;
    jsonObj['account']['contact']['firstName'] = config.dev.pm_api_firstname;
    jsonObj['account']['contact']['lastName'] = config.dev.pm_api_lastname;
    jsonObj['account']['contact']['address']['attr'] = config.dev.pm_api_address;
    jsonObj['account']['organization']['attr']['name'] = config.dev.pm_api_orgname;

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



