import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import axios from "axios";

export const subCommand = async (interaction) => {
  const selectAcountType: string = interaction.options.get("type").value;
  const playerId: string = interaction.member.id;

  //list all riot accounts with a button for each account for user
  switch (selectAcountType) {
    case "riot":
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/accounts/riot/get/" + playerId
        );

        let riotAccountEmbedList = [];
        const selectRiotAccountRow = new ActionRowBuilder();

        for (let riotAccountObj of data) {
          let selectButtonStyle, embedColour;

          //check if if its an active account change colour of embed and button
          if (riotAccountObj.active) {
            embedColour = 0x3ba55b;
            selectButtonStyle = ButtonStyle.Success;
          } else {
            embedColour = 0xec4245;
            selectButtonStyle = ButtonStyle.Danger;
          }

          let riotAccountEmbed = new EmbedBuilder()
            .setColor(embedColour)
            .setTitle(riotAccountObj.riot_id)
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

          selectRiotAccountRow.addComponents(
            new ButtonBuilder()
              .setLabel(riotAccountObj.riot_id)
              .setCustomId(
                `select-riot-${interaction.member.id}-${riotAccountObj.riot_id}-${interaction.id}`
              )
              .setStyle(selectButtonStyle)
          );
        }

        await interaction.reply({
          embeds: riotAccountEmbedList,
          components: [selectRiotAccountRow],
          fetchReply: true,
        });

        break;
      } catch (error) {
        console.error(error);
      }

    case "steam":
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/accounts/steam/get/" + playerId
        );

        let steamAccountEmbedList = [];
        const selectSteamAccountRow = new ActionRowBuilder();

        for (let steamAccountObj of data) {
          let selectButtonStyle, embedColour;
          //check if if its an active account change colour of embed and button
          if (steamAccountObj.active) {
            embedColour = 0x3ba55b;
            selectButtonStyle = ButtonStyle.Success;
          } else {
            embedColour = 0xec4245;
            selectButtonStyle = ButtonStyle.Danger;
          }

          let steamAccountEmbed = new EmbedBuilder()
            .setColor(embedColour)
            .setTitle(steamAccountObj.account_name)
            .setURL(steamAccountObj.steam_profile_url)
            .addFields({
              name: "Friend Code:",
              value: steamAccountObj.friendCode,
            });

          steamAccountEmbedList.push(steamAccountEmbed);

          selectSteamAccountRow.addComponents(
            new ButtonBuilder()
              .setLabel(steamAccountObj.account_name)
              .setCustomId(`select-steam-${steamAccountObj.account_name}`)
              .setStyle(selectButtonStyle)
          );
        }

        await interaction.reply({
          embeds: steamAccountEmbedList,
          components: [selectSteamAccountRow],
          fetchReply: true,
          ephemeral: false,
        });
        break;
      } catch (error) {
        console.error(error);
      }
  }
};
