const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');

/**
*whenever the queue command is used
*if queueEmbedId is not empty
*delete the old embed
*delete the old queueEmbedId
*send a new embed
*save the new queueEmbedId to data.json
*/

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("list of all commands"),

  async execute(interaction) {
    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);
    let queueEmbedId = dataObj.queueEmbedId;

    //if there is an embed
    if (queueEmbedId !== "") {
      //delete the old embed
      const channel = await interaction.channel.fetch(interaction.channelId);
      channel.messages.delete(queueEmbedId);
      console.log("LOG: \t" + "delete old queue embed");

      //delete the old queueEmbedId
      dataObj.queueEmbedId = "";
      writeToFile(dataObj, 'data.json');
    }

    //change all empty list to string "--empty--"
    let duoList = dataObj.duoList;
    duoList = JSON.stringify(duoList);
    if (duoList === "[]") {
      duoList = "--empty--";
    }
    //" "
    let trioList = dataObj.trioList;
    trioList = JSON.stringify(trioList);
    if (trioList === "[]") {
      trioList = "--empty--";
    }

    let fiveStackList = dataObj.fiveStackList;
    fiveStackList = JSON.stringify(fiveStackList);
    if (fiveStackList === "[]") {
      fiveStackList = "--empty--";
    }

    let oneVoneList = dataObj.oneVoneList;
    oneVoneList = JSON.stringify(oneVoneList);
    if (oneVoneList === "[]") {
      oneVoneList = "--empty--";
    }

    let tenMansList = dataObj.tenMansList;
    tenMansList = JSON.stringify(tenMansList);
    if (tenMansList === "[]") {
      tenMansList = "--empty--";
    }

    const statusEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("Status")
      .setDescription("Queue status")
      .addFields(
        { name: "Duo Rank Queue", value: duoList },
        { name: "Trio Rank Queue", value: trioList },
        { name: "Five Stack Rank Queue", value: fiveStackList },
        { name: "1v1 Queue", value: oneVoneList },
        { name: "10 Mans Queue", value: tenMansList },
      )
      .setTimestamp()
      .setColor(0xFF0000);

    //all the buttons for rank queue
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

    //all the buttons for unrated queue
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

    //send a new embed
    const queueEmbed = await interaction.reply({ embeds: [statusEmbed], components: [rankRow, unratedRow], fetchReply: true });
    console.log("LOG: \t" + "send new queue embed");

    //save the new queueEmbedId to data.json
    dataObj.queueEmbedId = queueEmbed.id;
    writeToFile(dataObj, 'data.json');
    console.log("LOG: \t" + "save new queueEmbedId to data.json");
  },
};
