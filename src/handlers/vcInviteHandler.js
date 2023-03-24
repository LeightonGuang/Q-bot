module.exports = (client) => {
  let newPrivateDuoVc = require("../handlers/privateVc/newPrivateDuoVc");
  newPrivateDuoVc(client);

  let newPrivateTrioVc = require("../handlers/privateVc/newPrivateTrioVc");
  newPrivateTrioVc(client);

  let newPrivateSquadVc = require("../handlers/privateVc/newPrivateSquadVc");
  newPrivateSquadVc(client);

  let newPrivateStackVc = require("../handlers/privateVc/newPrivateStackVc");
  newPrivateStackVc(client);

   
};
