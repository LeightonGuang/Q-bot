const fs = require("fs");
const writeToFile = require("../../../utils/writeToFile");

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const splittedArray = interaction.customId.split('-');

  if (splittedArray[0] !== "delete") return;

  let accountType = splittedArray[1];
  let uniqueIdentifier = splittedArray[2];
  let replyMsgId = splittedArray[3];

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerId = interaction.member.id;

  let playerObj = playerList.find((obj) => obj.id === playerId);

  if (accountType === "riot") {
    //go through riotAccountList to change which account to be active
    for (let riotAccountObj of playerObj.riotAccountList) {

      if (riotAccountObj.riotId === uniqueIdentifier) {
        //delete account obj
      }
    }

    writeToFile(dataObj, "data.json");
    interaction.message.delete(replyMsgId);

  } else if (accountType === "steam") {

    for (let steamAccountObj of playerObj.steamAccountList) {

      if (steamAccountObj.account === uniqueIdentifier) {
        steamAccountObj.active = true;

      } else if (steamAccountObj.account === uniqueIdentifier) {
        steamAccountObj.active = false;
      }
    }

    writeToFile(dataObj, "data.json");
  }
}