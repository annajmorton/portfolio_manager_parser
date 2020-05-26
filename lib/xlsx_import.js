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

meter_ids = meter_ids[9].concat(meter_ids[1]);
console.log(meter_ids[0]);
meter_ids = meter_ids.map(meter =>
    ({
        pm_name: meter['Meter Name (Required)'],
        pm_id: meter['Portfolio Manager ID (Pre-filled)'],
        cps_meter_id: meter['Custom Meter ID 1 Value (Required if you want to add one Custom ID)'],
        type: meter['Meter Type\r\n(Pre-filled)']
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

// pull meter data with PM id
var pm_meter_ids_gas = out_wb_slots.gas.map(slot => slot['Meter ID\n(Pre-filled)']);
var pm_meter_ids_elec = out_wb_slots.elec.map(slot => slot['Meter ID\n(Pre-filled)']);

module.exports = {
    meters: meters.flat(),
    meter_ids: meter_ids,
    out_wb_slots: out_wb_slots,
    pm_meter_ids_gas: pm_meter_ids_gas,
    pm_meter_ids_elec: pm_meter_ids_elec,
    pmid_to_serialno: function(pmid){
        
    },
    pull_data_by_pm_meter_id: function (pmid){
        return this.meters.filter(meter =>
            meter['Serial Number'] == pmid 
        );
    }
};
