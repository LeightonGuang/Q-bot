const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');

let duoList = ["empty"];
let trioList = ["empty"];
let fiveStackList = ["empty"];
let oneVoneList = ["empty"];
let tenMansList = ["empty"];

let queueIsEmpty = [duoList, trioList, fiveStackList, oneVoneList, tenMansList].every(list => list.length === 0);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("list of all commands"),

  async execute(interaction) {
    const emptyQueueEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("Queue")
      .setDescription("No one is queueing")
      .setTimestamp()

    const inQueueEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("Queue")
      .setDescription("Status")
      .addFields(
        { name: "duo", value: duoList.join(", ") },
        { name: "trio", value: trioList.join(", ") },
        { name: "5 stack", value: fiveStackList.join(", ") },
        { name: "1v1", value: oneVoneList.join(", ") },
        { name: "10 mans", value: tenMansList.join(", ") },
      )
      .setTimestamp()

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("duoQueue")
        .setLabel("duo queue")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("trioQueue")
        .setLabel("trio queue")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("fiveStackQueue")
        .setLabel("5 stack queue")
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

    if (queueIsEmpty) {
      await interaction.channel.send({
        embeds: ([emptyQueueEmbed]),
        components: [button]
      });

    } else {
      await interaction.channel.send({
        embeds: ([inQueueEmbed]),
        components: [button]
      });
    }
    interaction.reply("queue check");
    //if all the queues are empty then use emptyQueueEmbed
    console.log("LOG: \t embed queue");
  },
};
