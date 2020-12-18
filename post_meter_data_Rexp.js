// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';
const rp = require('request-promise');
var config = require('./config.js');
//const fs = require('fs').promises;
const fetch = require('node-fetch');

// env var
var env = config[config.env];
var pm_url_base = config.production.pm_api_uri;
var rmethod = 'POST';
console.log(pm_url_base)


// load xml file 
var xml_set = require('./lib/load_meter_xml.js');
// load meter ids
var meter_ids = require('./lib/xlsx_import_Rexp.js');
var meter_ids_log = [];
for(let i = 0; i < xml_set.send_xml.meter_data.length; i++){

    var send_xml = xml_set.send_xml.meter_data[i];
    //search for pm meter id with util id from file
    // test pm id 93070983;
    //var util_id = '6091235';
    var util_id = xml_set.send_xml.cpse_meter_ids[i];
    var active_index = meter_ids.util_ids.indexOf(util_id);
    var meter_id = meter_ids.pm_meter_ids[active_index];
    meter_ids_log.push([meter_id,util_id]);
    if(!meter_id || meter_id.length == 0) {
        console.log("no Portfolio Manager id for utiilty meter id " + util_id);
        continue
    }

    postMeters2PM(send_xml,meter_id);
    console.log("this ran all the way through for i: " + i);
}
console.log(meter_ids_log);

//load and process the data
function postMeters2PM(send_xml,meter_id) {
        var resource_url = "/meter/" + meter_id + "/consumptionData";
        var url  = pm_url_base + resource_url;
        var request_options = {
            method: rmethod,
            body: send_xml,
            headers:{
                'Content-Type':'application/xml',
                'Authorization': 'Basic ' + Buffer.from(env.pm_api_username + ':' + env.pm_api_password).toString('base64')
            },
        };
         fetch(url, request_options)
            .then(res => res.text()) // expecting a json response
            .then(json => console.log(json));       

    }



