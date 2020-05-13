const XLSX = require('xlsx')
var out_wb = XLSX.readFile('./data/output.xlsx');
var data = require('./lib/xlsx_import.js')

XLSX.write(out_wb,);
console.log(data);
