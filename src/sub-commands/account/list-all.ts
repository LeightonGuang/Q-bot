import { EmbedBuilder } from "discord.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

export const subCommand = async (interaction) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );

  const dataFile = fs.readFileSync(dataFilePath, "utf-8");
  const dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerId = interaction.member.id;
  let playerObj = playerList.find((obj) => obj.id === playerId);

  let accountEmbedList = [];

  //embed indicating steam accounts
  let riotHeaderEmbed = new EmbedBuilder()
    .setColor(0xff4553)
    .setTitle("Your riot account(s)");

  accountEmbedList.push(riotHeaderEmbed);

  for (let riotAccountObj of playerObj.riotAccountList) {
    let riotAccountEmbed = new EmbedBuilder()
      .setTitle(riotAccountObj.riotId)
      .addFields([
        { name: "Region:", value: riotAccountObj.region, inline: true },
        { name: "Rank:", value: riotAccountObj.rank, inline: true },
        {
          name: "Active:",
          value: riotAccountObj.active.toString(),
          inline: true,
        },
      ]);

    if (riotAccountObj.active === true) {
      riotAccountEmbed.setColor(0x3ba55b);
    } else if (riotAccountObj.active === false) {
      riotAccountEmbed.setColor(0xec4245);
    }

    //console.log(JSON.stringify(riotAccountEmbed));
    accountEmbedList.push(riotAccountEmbed);
  }

  //embed indicating steam accounts
  let steamHeaderEmbed = new EmbedBuilder()
    .setColor(0x2a475e)
    .setTitle("Your steam account(s)");

  accountEmbedList.push(steamHeaderEmbed);

  for (let steamAccountObj of playerObj.steamAccountList) {
    let steamAccountEmbed = new EmbedBuilder()
      .setTitle(steamAccountObj.accountName)
      .setFields({
        name: "LINK:",
        value: `[profile](${steamAccountObj.steamProfileUrl})`,
      });

    if (steamAccountObj.active === true) {
      steamAccountEmbed.setColor(0x3ba55b);
    } else if (steamAccountObj.active === false) {
      steamAccountEmbed.setColor(0x2a475e);
    }

    accountEmbedList.push(steamAccountEmbed);
  }

  await interaction.reply({
    embeds: accountEmbedList,
    ephemeral: true,
  });
};
