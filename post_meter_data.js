// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';
const rp = require('request-promise');
var {DateTime} = require('luxon');
DateTime.local();

var config = require('./config.js');
var PM_parser = require('./lib/pm_Jxml_parser.js');
var PMp = new PM_parser;
var meter_fulldata = require('./lib/meter_fulldata_xml2json.js');

// env var
var env = config[config.env];
var pm_url_base = config.dev.pm_api_uri;
var meters = env.shared[0].properties[0].meters;
var rmethod = 'POST';
var j2x = PMp.j2xml();

//load consumption data
var up_data = require('./lib/xlsx_import.js');

//make excel dates work
function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569)*86400*1000));
}

//to date we need
function dateConvo(date) {
    var temp_date = ExcelDateToJSDate(date);
    temp_date = DateTime.fromJSDate(temp_date);
    return temp_date.toFormat('yyyy-MM-dd');
}


//load and process the data
function postMeters2PM(data,pmid) {
    for(var i=0; i < pmid.length; i++){
        var meter = pmid[i];
        
        var meter_up_data = up_data.pull_data_by_util_id(meter.util_id);
        var resource_url = '/meter/' + meter.pm_meter_id +'/consumptionData';
        var tempvalJson = [];

        for(var j=0; j < meter_up_data.length; j++){
            var data_step = meter_up_data[j];
            let stepJson = JSON.parse(JSON.stringify(data.meterData.meterConsumption));
            stepJson.usage = data_step['Bill.qty'];
            stepJson.cost = data_step.Amount;

            var dend = data_step['Read Date'];
            stepJson.startDate = dateConvo(dend - data_step.Days);
            stepJson.endDate = dateConvo(dend);
            
            if(stepJson.demandTracking){
                stepJson.demandTracking.demand = data_step['Billing Demand'];
                stepJson.demandTracking.demandCost = 0;
            }

            tempvalJson.push(stepJson);

        }
        
        let temp_data = JSON.parse(JSON.stringify(data));
        temp_data.meterData.meterConsumption = tempvalJson;
        console.log(temp_data);
        var send_xml = j2x.parse(temp_data);
        
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

    }
}

// run electric 
var elec_pmid = up_data.pm_meter_ids_elec;
meter_fulldata.elec
    .then(function(data){
        postMeters2PM(data,elec_pmid);
    })
    .catch(console.log);

// run gas
var gas_pmid = up_data.pm_meter_ids_gas;
meter_fulldata.gas
    .then(function(data){
        postMeters2PM(data,gas_pmid);
    })
    .catch(console.log);

