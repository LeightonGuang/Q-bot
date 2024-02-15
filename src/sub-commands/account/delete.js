const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");

module.exports = async (interaction) => {
  let deleteAccountType = interaction.options.get("type").value;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let playerId = interaction.member.id;
  let playerObj = playerList.find((obj) => obj.id === playerId);

  switch (deleteAccountType) {
    case "riot":
      let riotAccountEmbedList = [];
      const deleteRiotAccountRow = new ActionRowBuilder();

      for (let riotAccountObj of playerObj.riotAccountList) {
        //go through each riot account to make an embed and button
        let riotAccountEmbed = new EmbedBuilder()
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
