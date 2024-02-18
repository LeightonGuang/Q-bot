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
  const playerObj: PlayerObj = playerList.find((obj) => obj.id === playerId);

  switch (deleteAccountType) {
    case "riot":
      if (playerObj.riotAccountList.length === 0) {
        const errorEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xff4553)
          .setTitle("Error")
          .setDescription("You don't have any riot accounts!");

        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

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
      if (playerObj.steamAccountList.length === 0) {
        const errorEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xff4553)
          .setTitle("Error")
          .setDescription("You don't have any steam accounts!");

        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      const steamAccountEmbedList: EmbedBuilder[] = [];
      const deleteSteamAccountRow: ActionRowBuilder = new ActionRowBuilder();

      for (let steamAccountObj of playerObj.steamAccountList) {
        const steamAccountEmbed = new EmbedBuilder()
          .setColor(0xec4245)
          .setTitle(steamAccountObj.accountName)
          .addFields([
            {
              name: "Steam Profile Url:",
              value: steamAccountObj.steamProfileUrl,
              inline: true,
            },
            {
              name: "Friend Code:",
              value: steamAccountObj.friendCode.toString(),
              inline: true,
            },
            {
              name: "Active:",
              value: steamAccountObj.active.toString(),
              inline: true,
            },
          ]);

        steamAccountEmbedList.push(steamAccountEmbed);

        deleteSteamAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(`DELETE: ${steamAccountObj.accountName}`)
            .setCustomId(
              `delete-steam-${steamAccountObj.accountName}-${interaction.id}`
            )
            .setStyle(ButtonStyle.Danger)
        );
      }

      await interaction.reply({
        embeds: steamAccountEmbedList,
        components: [deleteSteamAccountRow],
        fetchReply: true,
      });

      break;
  }
};
