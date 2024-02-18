import { EmbedBuilder } from "discord.js";
import fs from "fs";
import { writeToFile } from "../../utils/writeToFile.js";
import { fileURLToPath } from "url";
import path from "path";

export const subCommand = async (interaction) => {
  const playerId: number = interaction.member.id;
  const steamAccountName: string =
    interaction.options.get("account-name").value;
  const steamFriendCode: number = parseInt(
    interaction.options.get("friend-code").value
  );
  const steamProfileUrl: string =
    interaction.options.get("steam-profile-url").value;

  if (
    typeof steamFriendCode !== "number" ||
    !steamProfileUrl.startsWith("https://steamcommunity.com/id/")
  ) {
    const errorEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("Error");

    if (typeof steamFriendCode !== "number") {
      errorEmbed.addFields({
        name: "Your input: " + steamFriendCode,
        value: "Please enter a valid friend code.",
      });
    }

    if (!steamProfileUrl.startsWith("https://steamcommunity.com/id/")) {
      errorEmbed.addFields({
        name: "Your input: " + steamProfileUrl,
        value:
          "Please enter a valid steam profile url. (Example: `https://steamcommunity.com/id/yourname`)",
      });
    }

    interaction.reply({
      embeds: [errorEmbed],
      ephemeral: true,
    });
    return;
  }

  const currentFilePath: string = fileURLToPath(import.meta.url);
  const dataFilePath: string = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );
  const dataFile: string = fs.readFileSync(dataFilePath, "utf-8");
  type SteamAccountObj = {
    accountName: string;
    friendCode: number;
    steamProfileUrl: string;
    active: boolean;
  };

  type PlayerObj = {
    id: number;
    tag: string;
    steamAccountList: SteamAccountObj[];
  };

  type DataObject = {
    playerList: PlayerObj[];
  };

  const dataObj: DataObject = JSON.parse(dataFile);
  const playerList: PlayerObj[] = dataObj.playerList;
  const playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);

  const steamFriendCodeDuplicate: SteamAccountObj =
    playerObj.steamAccountList.find(
      (obj) => obj.friendCode === steamFriendCode
    );
  if (steamFriendCodeDuplicate) {
    //if the riot account is already added
    interaction.reply({
      content: "You've already added this account.",
      ephemeral: true,
    });
    console.log("LOG: \t" + "riot id already added");
    return;
  }

  const steamAccountObj: SteamAccountObj = {
    accountName: steamAccountName,
    friendCode: steamFriendCode,
    steamProfileUrl: steamProfileUrl,
    active: false,
  };

  playerObj.steamAccountList.push(steamAccountObj);
  writeToFile(dataObj);

  await interaction.reply({
    content:
      "new steam account added\n" +
      `Account Name: \t${steamAccountName}\n` +
      `Friend Code: \t${steamFriendCode}\n` +
      `Steam Profile URL: \t${steamProfileUrl}`,
    ephemeral: true,
  });

  console.log(
    "new steam account added\n" +
      `Account Name: \t${steamAccountName}\n` +
      `Friend Code: \t${steamFriendCode}\n` +
      `Steam Profile URL: \t${steamProfileUrl}`
  );
};
