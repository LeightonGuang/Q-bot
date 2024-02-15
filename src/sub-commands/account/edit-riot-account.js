const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const writeToFile = require("../../utils/writeToFile");

module.exports = async (interaction) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let playerList = dataObj.playerList;

  let rank = interaction.options.get("rank")?.value;
  let riotId = interaction.options.get("riot-id")?.value;
  let region = interaction.options.get("region")?.value;

  if (rank || riotId || region) {
    let memberId = interaction.member.id;
    let playerObj = playerList.find((obj) => obj.id === memberId);
    let riotAccount = playerObj.riotAccountList.find(
      (obj) => obj.active === true
    );

    if (rank) {
      riotAccount.rank = rank;
      writeToFile(dataObj, "data.json");
      console.log("LOG:\t" + `member has edited their rank to ${rank}`);
    }

    if (riotId) {
      riotAccount.riotId = riotId;
      writeToFile(dataObj, "data.json");
      console.log("LOG:\t" + `member has edited their Riot id to ${riotId}`);
    }

    if (region) {
      riotAccount.region = region;
      writeToFile(dataObj, "data.json");
      console.log("LOG:\t" + `member has edited their region to ${region}`);
    }

    let riotAccountEmbed = new EmbedBuilder()
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
