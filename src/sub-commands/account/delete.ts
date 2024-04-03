import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import axios from "axios";

import { RiotAccount } from "../../types/RiotAccount.js";
import { SteamAccount } from "../../types/SteamAccount.js";

export const subCommand = async (interaction) => {
  const deleteAccountType: string = interaction.options.get("type").value;
  const playerId: number = interaction.member.id;

  switch (deleteAccountType) {
    case "riot": {
      const { data }: { data: RiotAccount[] } = await axios.get(
        "http://localhost:8080/api/account/riot/get/" + playerId
      );
      if (data.length === 0) {
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

      for (let riotAccount of data) {
        //go through each riot account to make an embed and button
        const riotAccountEmbed = new EmbedBuilder()
          .setColor(0xec4245)
          .setTitle(riotAccount.riot_id)
          .addFields([
            {
              name: "Region:",
              value: riotAccount.region,
              inline: true,
            },
            {
              name: "Rank:",
              value: riotAccount.rank,
              inline: true,
            },
            {
              name: "Active:",
              value: riotAccount.active.toString(),
              inline: true,
            },
          ]);

        riotAccountEmbedList.push(riotAccountEmbed);

        deleteRiotAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(`DELETE: ${riotAccount.riot_id}`)
            .setCustomId(
              `delete-riot-${interaction.member.id}-${riotAccount.riot_id}-${interaction.id}`
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
    }

    case "steam": {
      const { data }: { data: SteamAccount[] } = await axios.get(
        "http://localhost:8080/api/account/steam/get/" + playerId
      );

      if (data.length === 0) {
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

      for (let steamAccount of data) {
        const steamAccountEmbed = new EmbedBuilder()
          .setColor(0xec4245)
          .setTitle(steamAccount.account_name)
          .addFields([
            {
              name: "Steam Profile Url:",
              value: steamAccount.steam_profile_url,
              inline: true,
            },
            {
              name: "Friend Code:",
              value: steamAccount.friend_code.toString(),
              inline: true,
            },
            {
              name: "Active:",
              value: steamAccount.active.toString(),
              inline: true,
            },
          ]);

        steamAccountEmbedList.push(steamAccountEmbed);

        deleteSteamAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(`DELETE: ${steamAccount.account_name}`)
            .setCustomId(
              `delete-steam-${interaction.member.id}-${steamAccount.steam_id}-${interaction.id}`
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

    case "account": {
      //delete all accounts from database

      try {
        const { data: isRegistered }: { data: boolean } = await axios.get(
          "http://localhost:8080/api/account/isRegistered/" + playerId
        );

        if (isRegistered) {
          await axios.delete(
            "http://localhost:8080/api/account/delete/" + interaction.member.id
          );

          await interaction.reply({
            content: "***All accounts have been deleted!***",
            ephemeral: true,
          });
        } else if (!isRegistered) {
          await interaction.reply({
            content: "You don't have an account",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error(error);
      }

      break;
    }
  }
};
