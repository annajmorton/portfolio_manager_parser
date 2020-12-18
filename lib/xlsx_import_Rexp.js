const XLSX = require('xlsx')
var in_wb = XLSX.readFile('./data/Add_Bills_to_Meters.xlsx');
var meter_ids = [];

// PM Id and input Id
var meter_id = in_wb.Sheets['Add Bills-Electricity'];
var meter_id_sheet = XLSX.utils.sheet_to_json(meter_id);
meter_ids.push(meter_id_sheet);

var meter_id_gas = in_wb.Sheets['Add Bills-Non Electric'];
var meter_id_sheet_gas = XLSX.utils.sheet_to_json(meter_id_gas);
meter_ids.push(meter_id_sheet_gas);
meter_ids = meter_ids[0].concat(meter_ids[1]);

//console.log(meter_ids);
//console.log(meter_ids[0]);
//console.log(meter_ids[0]['Portfolio Manager ID\n(Pre-filled)']);

meter_ids = meter_ids.map(meter =>
    ({
        pm_pro_id: meter['Portfolio Manager ID\n(Pre-filled)'],
        pm_meter_id: meter['Meter ID\n(Pre-filled)'],
        util_id: meter['Meter Name\n(Pre-filled)'],
        type: meter['Meter Type\n(Pre-filled)']
    })
);


pm_pro_id = [];
pm_meter_id = [];
util_id = [];
meter_type = [];

// meter chunks 
meter_ids.forEach(function(meter){
    pm_pro_id.push(meter.pm_pro_id);
    pm_meter_id.push(meter.pm_meter_id);
    util_id.push(meter.util_id);
    meter_type.push(meter.type);
});

module.exports = {
    meter_ids: meter_ids,
    pm_pro_ids: pm_pro_id,
    pm_meter_ids: pm_meter_id,
    util_ids: util_id,
    meter_types: meter_type,
};
