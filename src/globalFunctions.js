const fs = require('node:fs');

function writeToFile(data, file) {
  fs.writeFileSync(file, data);
}

module.exports = {
  writeToFile
}