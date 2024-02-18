import { EmbedBuilder } from "discord.js";
import fs from "fs";
import { writeToFile } from "../../../utils/writeToFile.js";
import { fileURLToPath } from "url";
import path from "path";

export const handler = async (interaction) => {
  console.log("FILE: \t" + "deleteAccountHandler.js");
  if (!interaction.isButton()) return;

  const splittedArray: string[] = interaction.customId.split("-");

  if (splittedArray[0] !== "delete") return;

  const accountType: string = splittedArray[1];
  const riotId: string = splittedArray[2];
  const replyMsgId: string = splittedArray[3];

  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../../public/data.json"
  );
  const dataFile = fs.readFileSync(dataFilePath, "utf-8");

  type RiotAccountObj = {
    riotId: string;
    region: string;
    rank: string;
    active: boolean;
  };

  type SteamAccountObj = {
    accountName: string;
    friendCode: number;
    steamProfileUrl: string;
    active: boolean;
  };

  type PlayerObj = {
    id: number;
    tag: string;
    riotAccountList: RiotAccountObj[];
    steamAccountList: SteamAccountObj[];
  };

  type DataObject = {
    playerList: PlayerObj[];
  };

  const dataObj: DataObject = JSON.parse(dataFile);
  const playerList: PlayerObj[] = dataObj.playerList;
  const playerId: number = interaction.member.id;
  let playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);

  if (accountType === "riot") {
    //go through riotAccountList to change which account to be active
    for (let riotAccountObj of playerObj.riotAccountList) {
      if (riotAccountObj.riotId === riotId) {
        playerObj.riotAccountList = playerObj.riotAccountList.filter(
          (account) => account !== riotAccountObj
        );

        if (playerObj.riotAccountList.length !== 0) {
          playerObj.riotAccountList[0].active = true;
        }

        writeToFile(dataObj);
        // dataObj.playerList = playerList;
        interaction.message.delete(replyMsgId);
        const deleteEmbed = new EmbedBuilder()
          .setColor(0xffff00)
          .setTitle("Valorant Account")
          .setDescription(`Account **${riotId}** has been deleted.`);
        interaction.channel.send({ embeds: [deleteEmbed] });
        break;
      }
    }
  } else if (accountType === "steam") {
    // for (let steamAccountObj of playerObj.steamAccountList) {
    //   if (steamAccountObj.account === uniqueIdentifier) {
    //     steamAccountObj.active = true;
    //   } else if (steamAccountObj.account === uniqueIdentifier) {
    //     steamAccountObj.active = false;
    //   }
    // }
    // writeToFile(dataObj);
  }
};
