// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';
const fs = require('fs').promises;

var PM_parser = require('./pm_Jxml_parser.js');
var PMp = new PM_parser;

// path to xml templates to be made to json 
var inputxml_elec = "pm_api/template_xml/electric_meter_fulldata.xml";
var inputxml_other = "pm_api/template_xml/other_meter_fulldata.xml";

async function loadElecData() {
    const elec_data = await fs.readFile(inputxml_elec, 'utf8');
    var jelec_data = PMp.xml2j(elec_data);
    return jelec_data;
}

async function loadGasData() {
    const gas_data = await fs.readFile(inputxml_other, 'utf8');
    var jgas_data = PMp.xml2j(gas_data);
    return jgas_data;
}

module.exports = {
    elec: loadElecData(),
    gas: loadGasData()
};

