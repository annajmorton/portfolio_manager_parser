const XLSX = require('xlsx')
var in_wb = XLSX.readFile('./data/input.xlsx');
var out_wb = XLSX.readFile('./data/template.xlsx');
var idg_wb = XLSX.readFile('./data/meterg_id.xlsx');
var ide_wb = XLSX.readFile('./data/metere_id.xlsx');
var meters = [];
var meter_ids = [];
var out_wb_slots = [];

// PM Id and input Id
idg_wb.SheetNames.forEach(function(sheetname){
    var meter_id = idg_wb.Sheets[sheetname];
    var meter_id_sheet = XLSX.utils.sheet_to_json(meter_id);
    meter_ids.push(meter_id_sheet);
});
ide_wb.SheetNames.forEach(function(sheetname){
    var meter_id = ide_wb.Sheets[sheetname];
    var meter_id_sheet = XLSX.utils.sheet_to_json(meter_id);
    meter_ids.push(meter_id_sheet);
});

meter_ids = {elec: meter_ids[9], gas: meter_ids[1]};

meter_ids.elec = meter_ids.elec.map( meter => 
    ({
        pm_name: meter['Meter Name (Required)'],
        cps_meter_id: meter['Custom Meter ID 1 Value (Required if you want to add one Custom ID)']
    })
);

meter_ids.gas = meter_ids.gas.map(meter =>
    ({
        pm_name: meter['Meter Name (Required)'],
        cps_meter_id: meter['Custom Meter ID 1 Value (Required if you want to add one Custom ID)']
    })
);

// Read the utility data from CPS Energy 
in_wb.SheetNames.forEach(function(sheetname){
    var meter = in_wb.Sheets[sheetname];
    var meter_sheet = XLSX.utils.sheet_to_json(meter);
    meters.push(meter_sheet);
});

//console.log(meters);

// Read PM template
out_wb.SheetNames.forEach(function(sheetname){
    var slot = out_wb.Sheets[sheetname];
    var slot_sheet = XLSX.utils.sheet_to_json(slot);
    out_wb_slots.push(slot_sheet);
});


out_wb_slots.elec = out_wb_slots[1].flat();
out_wb_slots.gas = out_wb_slots[2].flat();

out_wb_slots = {
    elec:out_wb_slots.elec,
    gas:out_wb_slots.gas
};

module.exports = {
    meters: meters.flat(),
    meter_ids: meter_ids,
    out_wb_slots: out_wb_slots
};
