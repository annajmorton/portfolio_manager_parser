// this create only works in the test API
// this needs to be updated for 
// live portfolio manager API
// Copyright 2020 Morton Gestalt LLC
'use strict';
const fs = require('fs');

// path to xml files with CPSE default export 
var filedir = './data/meter_xml/'
var send_xml =  { 
    'cpse_meter_ids': [],
    'meter_data': []
}

function readXMLfiles() {
    var filenames = fs.readdirSync(filedir);
    
    for(let filename of filenames){
        var temp_filename = filename.replace(".xml","");
        temp_filename = temp_filename.slice(3); 
        send_xml.cpse_meter_ids.push(temp_filename);
        
        var content = fs.readFileSync(filedir + filename,'utf-8');
        send_xml.meter_data.push(content);
    }
    return send_xml;
}

module.exports = {
    send_xml: readXMLfiles()
};

