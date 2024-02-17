import { EmbedBuilder } from "discord.js";
import fs from "fs";
import { writeToFile } from "../../utils/writeToFile.js";
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
  const playerList = dataObj.playerList;

  const rank = interaction.options.get("rank")?.value;
  const riotId = interaction.options.get("riot-id")?.value;
  const region = interaction.options.get("region")?.value;

  if (rank || riotId || region) {
    const memberId = interaction.member.id;
    const playerObj = playerList.find((obj) => obj.id === memberId);
    const riotAccount = playerObj.riotAccountList.find(
      (obj) => obj.active === true
    );

    if (rank) {
      riotAccount.rank = rank;
      writeToFile(dataObj);
      console.log("LOG:\t" + `member has edited their rank to ${rank}`);
    }

    if (riotId) {
      riotAccount.riotId = riotId;
      writeToFile(dataObj);
      console.log("LOG:\t" + `member has edited their Riot id to ${riotId}`);
    }

    if (region) {
      riotAccount.region = region;
      writeToFile(dataObj);
      console.log("LOG:\t" + `member has edited their region to ${region}`);
    }

    const riotAccountEmbed = new EmbedBuilder()
      .setColor(0x3ba55b)
      .setTitle(riotAccount.riotId)
      .addFields(
        { name: "Rank:", value: riotAccount.rank },
        { name: "Region:", value: riotAccount.region }
      );

    await interaction.reply({
      content: "Riot account edited successfully",
      embeds: [riotAccountEmbed],
      ephemeral: true,
    });
  }
};
