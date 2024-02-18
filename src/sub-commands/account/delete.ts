import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

export const subCommand = async (interaction) => {
  let deleteAccountType: string = interaction.options.get("type").value;

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

  const playerId: number = interaction.member.id;
  const playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);

  switch (deleteAccountType) {
    case "riot":
      const riotAccountEmbedList: EmbedBuilder[] = [];
      const deleteRiotAccountRow: ActionRowBuilder = new ActionRowBuilder();

      for (let riotAccountObj of playerObj.riotAccountList) {
        //go through each riot account to make an embed and button
        const riotAccountEmbed = new EmbedBuilder()
          .setColor(0xec4245)
          .setTitle(riotAccountObj.riotId)
          .addFields([
            {
              name: "Region:",
              value: riotAccountObj.region,
              inline: true,
            },
            {
              name: "Rank:",
              value: riotAccountObj.rank,
              inline: true,
            },
            {
              name: "Active:",
              value: riotAccountObj.active.toString(),
              inline: true,
            },
          ]);

        riotAccountEmbedList.push(riotAccountEmbed);

        deleteRiotAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(`DELETE: ${riotAccountObj.riotId}`)
            .setCustomId(
              `delete-riot-${riotAccountObj.riotId}-${interaction.id}`
            )
            .setStyle(ButtonStyle.Danger)
        );
      }

      await interaction.reply({
        embeds: riotAccountEmbedList,
        components: [deleteRiotAccountRow],
        fetchReply: true,
      });

      break;

    case "steam":
      break;
  }
};
