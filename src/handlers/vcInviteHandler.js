module.exports = (client) => {
  let newPrivateDuoVc = require("../handlers/privateVc/newPrivateDuoVc");
  newPrivateDuoVc(client);

  let newPrivateTrioVc = require("../handlers/privateVc/newPrivateTrioVc");
  newPrivateTrioVc(client);
};
