const parser = require('fast-xml-parser');
const J2X_parser = require('fast-xml-parser').j2xParser;
const he = require('he');

module.exports = class PM_parser {

    constructor(){
        this.xml2J_options = {
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
        },
        this.J2xml_options = {
            attributeNamePrefix : "",
            attrNodeName: "attr", //default is false
            ignoreAttributes : false,
            cdataTagName: "__cdata", //default is false
            cdataPositionChar: "\\c",
            format: false,
            indentBy: "  ",
            supressEmptyNode: false,
        };
    }

    xml2j(data) {
        return parser.parse(data,this.xml2J_options);
    }
    
    j2xml(){
        return  new J2X_parser(this.J2xml_options);
    }

};
