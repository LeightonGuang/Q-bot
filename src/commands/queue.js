const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("list of all commands"),

  async execute(interaction) {
    let dataFile = fs.readFileSync('data.json');
    let jsonData = JSON.parse(dataFile);

    duoList = jsonData.duoList;
    duoList = JSON.stringify(duoList);
    if (duoList === "[]") {
      duoList = "--empty--";
    }
    //" "
    trioList = jsonData.trioList;
    trioList = JSON.stringify(trioList);
    if (trioList === "[]") {
      trioList = "--empty--";
    }

    fiveStackList = jsonData.fiveStackList;
    fiveStackList = JSON.stringify(fiveStackList);
    if (fiveStackList === "[]") {
      fiveStackList = "--empty--";
    }

    oneVoneList = jsonData.oneVoneList;
    oneVoneList = JSON.stringify(oneVoneList);
    if (oneVoneList === "[]") {
      oneVoneList = "--empty--";
    }

    tenMansList = jsonData.tenMansList;
    tenMansList = JSON.stringify(tenMansList);
    if (tenMansList === "[]") {
      tenMansList = "--empty--";
    }

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
      .setColor(0xFF0000);

    const rankRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("duoRankQueue")
        .setLabel("duo rank")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("trioRankQueue")
        .setLabel("trio rank")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("fiveStackRankQueue")
        .setLabel("5 stack rank")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("oneVoneQueue")
        .setLabel("1v1 queue")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("tenMansQueue")
        .setLabel("10 mans queue")
        .setStyle(ButtonStyle.Success),
    )
    const unratedRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("unrated")
        .setLabel("unrated")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("dequeue")
        .setLabel("dequeue")
        .setStyle(ButtonStyle.Danger),
    )

    await interaction.reply('command queue');
    interaction.channel.send({ embeds: [statusEmbed], components: [rankRow, unratedRow] });
    //if all the queues are empty then use emptyQueueEmbed
    console.log("LOG: \t" + "embed queue");
  },
};
