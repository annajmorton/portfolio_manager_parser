// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';
const rp = require('request-promise');

var config = require('./config.js');
var PM_parser = require('./lib/pm_Jxml_parser.js');
var PMp = new PM_parser;
var meter_fulldata = require('./lib/meter_fulldata_xml2json.js');

// env var
var env = config[config.env];
var pm_url_base = config.dev.pm_api_uri;
var meters = env.shared[0].properties[0].meters;
var rmethod = 'POST';

//load consumption data
var up_data = require('./lib/xlsx_import.js');

//load and process the data
function postMeters2PM(data,pmid) {
    console.log(data);
    for(var i=0; i < pmid.length; i++){
        var meter = pmid[i];
        var meter_up_data = up_data.pull_data_by_util_id(meter.util_id);
        var resource_url = '/meter/' + meter.pm_meter_id +'/consumptionData';
        var formedJson = [];
        
        for(var j=0; j < meter_up_data.length; j++){
            var stepJson = data.meterData.meterConsumption;
            var data_step = meter_up_data[j];
            stepJson.usage = data_step['Bill.qty'];
            stepJson.cost = data_step.Amount;
            stepJson.startDate = data_step.Amount;
            stepJson.endDate = data_step.Amount;
            if(stepJson.demandTracking.demand){
                stepJson.demandTracking.demand = data_step.Demand;
                stepJson.demandTracking.demandCost = 0;
            }
            formedJson.push(stepJson);
        }
        //tjsonObj['account']['username'] = ;

        //var j2x = PMp.j2xml();
        //var send_xml = j2x.parse(tjsonObj);

        /*
        var request_options = {
            method: rmethod,
            url: pm_url_base + resource_url,
            headers:{
                'Content-Type':'application/xml',
                'Authorization': 'Basic ' + Buffer.from(env.pm_api_username + ':' + env.pm_api_password).toString('base64')
            },
            body: send_xml
        };

        rp(request_options)
            .then(function(parsedBody){
                console.log(parsedBody);
            })
            .catch(function(err){
                console.log(err);
            });

    */
    }
    console.log(formedJson);
}

// run electric 
var elec_pmid = up_data.pm_meter_ids_elec;
meter_fulldata.elec
    .then(function(data){
        postMeters2PM(data,elec_pmid);
    })
    .catch(console.log);


