const parse = require('csv-parse')
const assert = require('assert')
const fs = require('fs');

const output = []

var input_file = 'data.csv';

// Read the file
fs.createReadStream(input_file)
    .pipe(parse())
    .on('data', (row) => {
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

// Create the parser
const parser = parse({
  delimiter: ':'
})
// Use the readable stream api
parser.on('readable', function(){
  let record
  while (record = parser.read()) {
    output.push(record)
  }
})
// Catch any error
parser.on('error', function(err){
  console.error(err.message)
})
// When we are done, test that the parsed output matched what expected
parser.on('end', function(){
  assert.deepEqual(
    output,
    [
      [ 'root','x','0','0','root','/root','/bin/bash' ],
      [ 'someone','x','1022','1022','','/home/someone','/bin/bash' ]
    ]
  )
})
// Write data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n")
parser.write("someone:x:1022:1022::/home/someone:/bin/bash\n")
// Close the readable stream
parser.end()
