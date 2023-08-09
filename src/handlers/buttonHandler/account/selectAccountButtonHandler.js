const fs = require("fs");
const writeToFile = require("../../../utils/writeToFile");

module.exports = (interaction) => {
  if (!interaction.isButton()) return;

  //select-type-[id/name]
  const splittedArray = interaction.customId.split('-');

  //if button pressed is not a select account button
  if (splittedArray[0] !== "select") return;

  /**
   * use splittedArray[1] to get the type of account that the user want to select
   * use splittedArray[2] to get the user id that can click on the button
   * use splittedArray[3] to get the riotId that is selected
   * use splittedArray[4] to get the id of the message
   * get the player's object
   * go throught the the player's object
   * make "active attribute" in the riot account object that matches the riot id true
   * and everything else false
   *
   */

  let accountType = splittedArray[1];
  let userId = splittedArray[2];
  let uniqueIdentifier = splittedArray[3];
  let replyMsgId = splittedArray[4];
  //console.log("replyMsgId:\t" + replyMsgId);

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerObj = playerList.find((obj) => obj.id === userId);

  console.log(interaction.member.id + " and " + userId);

  //only the account owner can select their account
  if (interaction.member.id !== userId) {
    interaction.reply({ content: "This is not your account", ephemeral: true });
    console.log("LOG: \t" + "This is not your account");
    return;
  }

  if (accountType === "riot") {
    //go through riotAccountList to change which account to be active
    for (let riotAccountObj of playerObj.riotAccountList) {

      if (riotAccountObj.riotId === uniqueIdentifier) {
        riotAccountObj.active = true;

      } else if (riotAccountObj.riotId !== uniqueIdentifier) {
        riotAccountObj.active = false;
      }
    }

    writeToFile(dataObj, "data.json");
    interaction.message.delete(replyMsgId);
    interaction.reply({ content: `The account **${uniqueIdentifier}** is now selected!`, ephemeral: true });

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
};
