const fs = require('node:fs');

function writeToFile(data, file) {
  //data = an object
  let dataString = JSON.stringify(data, null, 2);
  fs.writeFileSync(file, dataString);
}

module.exports = {
  writeToFile
}