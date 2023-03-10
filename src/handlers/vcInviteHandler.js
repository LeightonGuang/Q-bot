module.exports = (client) => {
  let newPrivateDuoVc = require("../handlers/privateVc/newPrivateDuoVc");
  newPrivateDuoVc(client);
};
