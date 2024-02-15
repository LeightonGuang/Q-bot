const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");

module.exports = async (interaction) => {
  let selectAcountType = interaction.options.get("type").value;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerId = interaction.member.id;
  let playerObj = playerList.find((obj) => obj.id === playerId);

  //list all riot accounts with a button for each account for user
  switch (selectAcountType) {
    case "riot":
      let riotAccountEmbedList = [];
      const selectRiotAccountRow = new ActionRowBuilder();

      for (let riotAccountObj of playerObj.riotAccountList) {
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

        //console.log(JSON.stringify(riotAccountEmbed));

        riotAccountEmbedList.push(riotAccountEmbed);

        selectRiotAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(riotAccountObj.riotId)
            .setCustomId(
              `select-riot-${interaction.member.id}-${riotAccountObj.riotId}-${interaction.id}`
            )
            .setStyle(selectButtonStyle)
        );
      }

      await interaction.reply({
        embeds: riotAccountEmbedList,
        fetchReply: true,
      });

      interaction.editReply({ components: [selectRiotAccountRow] });

      break;

    case "steam":
      let steamAccountEmbedList = [];
      const selectSteamAccountRow = new ActionRowBuilder();

      for (let steamAccountObj of playerObj.steamAccountList) {
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
          .setTitle(steamAccountObj.accountname)
          .setURL(steamAccountObj.steamProfileUrl)
          .addFields({
            name: "Friend Code:",
            value: steamAccountObj.friendCode,
          });

        steamAccountEmbedList.push(steamAccountEmbed);

        selectSteamAccountRow.addComponents(
          new ButtonBuilder()
            .setLabel(steamAccountObj.accountName)
            .setCustomId(`select-steam-${steamAccountObj.accountName}`)
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
  }
};
