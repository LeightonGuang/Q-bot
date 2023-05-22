module.exports = (client) => {
  let newPrivateDuoVc = require("../handlers/privateVc/newPrivateDuoVc");
  newPrivateDuoVc(client);

  let newPrivateTrioVc = require("../handlers/privateVc/newPrivateTrioVc");
  newPrivateTrioVc(client);

  let newPrivateQuadVc = require("../handlers/privateVc/newPrivateQuadVc");
  newPrivateQuadVc(client);

  let newPrivateStackVc = require("../handlers/privateVc/newPrivateStackVc");
  newPrivateStackVc(client);


};
