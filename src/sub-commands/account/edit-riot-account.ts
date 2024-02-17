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

  type RiotAccountObj = {
    riotId: string;
    region: string;
    rank: string;
    active: boolean;
  };

  type PlayerObj = {
    id: number;
    tag: string;
    riotAccountList: RiotAccountObj[];
  };

  type DataObject = {
    playerList: PlayerObj[];
  };

  const dataObj: DataObject = JSON.parse(dataFile);

  const playerList: PlayerObj[] = dataObj.playerList;

  const rank: string = interaction.options.get("rank")?.value;
  const riotId: string = interaction.options.get("riot-id")?.value;
  const region: string = interaction.options.get("region")?.value;

  if (rank || riotId || region) {
    const memberId: number = interaction.member.id;

    const playerObj: PlayerObj = playerList.find((obj) => obj.id === memberId);
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
