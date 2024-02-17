import fs from "fs";
import { writeToFile } from "../../../utils/writeToFile.js";
import { fileURLToPath } from "url";
import path from "path";

export const handler = async (interaction) => {
  if (!interaction.isButton()) return;

  //select-type-[id/name]
  const splittedArray = interaction.customId.split("-");

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

  const accountType = splittedArray[1];
  const userId = splittedArray[2];
  const uniqueIdentifier = splittedArray[3];
  const replyMsgId = splittedArray[4];
  //console.log("replyMsgId:\t" + replyMsgId);

  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../../public/data.json"
  );
  const dataFile = fs.readFileSync(dataFilePath, "utf-8");
  const dataObj = JSON.parse(dataFile);
  const playerList = dataObj.playerList;

  const playerObj = playerList.find((obj) => obj.id === userId);

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
    interaction.reply({
      content: `The account **${uniqueIdentifier}** is now selected!`,
      ephemeral: true,
    });
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
