const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("get status of all queue"),

  async execute(interaction) {
    let dataFile = fs.readFileSync('data.json');
    let jsonData = JSON.parse(dataFile);



    duoList = jsonData.duoList;
    duoList = JSON.stringify(duoList);

    trioList = jsonData.trioList;
    trioList = JSON.stringify(trioList);

    fiveStackList = jsonData.fiveStackList;
    fiveStackList = JSON.stringify(fiveStackList);

    oneVoneList = jsonData.oneVoneList;
    oneVoneList = JSON.stringify(oneVoneList);

    tenMansList = jsonData.tenMansList;
    tenMansList = JSON.stringify(tenMansList);

    const statusEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("Status")
      .setDescription("Queue status")
      .addFields(
        { name: "Duo Queue", value: duoList },
        { name: "Trio Queue", value: trioList },
        { name: "Five Stack Queue", value: fiveStackList },
        { name: "1v1 Queue", value: oneVoneList },
        { name: "10 Mans Queue", value: tenMansList },
      )
      .setTimestamp()

    await interaction.reply({ embeds: [statusEmbed] });
    console.log("LOG: \t embed sent");
  },
};
