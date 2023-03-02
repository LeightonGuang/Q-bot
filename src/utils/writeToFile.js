const fs = require('node:fs');

module.exports = (data, file) => {
  //data = an object
  let dataString = JSON.stringify(data, null, 2);
  fs.writeFileSync(file, dataString);
}