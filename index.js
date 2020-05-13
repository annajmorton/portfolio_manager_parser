// Copyright 2020 Morton Gestalt LLC
'use strict';

// [START gae_flex_quickstart]
const request = require('request');
var config = require('./config.js');

var pm_url_base = "https://portfoliomanager.energystar.gov/wstest";

var parser = require('fast-xml-parser');
var J2X_parser = require('fast-xml-parser').j2xParser;
var he = require('he');
var fs = require('fs');

var options = {
    attributeNamePrefix : "",
    attrNodeName: "attr", //default is 'false'
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
};

var j2x_options = {
    attributeNamePrefix : "",
    attrNodeName: "attr", //default is false
    ignoreAttributes : false,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
};

var j2x = new J2X_parser(j2x_options);

fs.readFile('./pm_api/template_xml/post_account.xml', 'utf8',function(err,data){
    console.log(data);

    var jsonObj = parser.parse(data,options);
    jsonObj['account']['username'] = config.dev.pm_api_username;
    jsonObj['account']['password'] = config.dev.pm_api_password;
    console.log(jsonObj);
    
    var send_xml = j2x.parse(jsonObj);
    console.log(send_xml);

    request.post({
        url: pm_url_base + "/account",
        port: 9000,
        method: "POST",
        headers:{
            'Content-Type':'application/xml'
        },
        body:send_xml 
    },
    function(error,response,body){
        console.log(response.statusCode);
        console.log(body);
        console.log(error);
    });
});



