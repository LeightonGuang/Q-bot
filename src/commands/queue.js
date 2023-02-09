const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');

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
      .setTimestamp()

    const buttonRow1 = new ActionRowBuilder().setComponents(
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
    const buttonRow2 = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("unrated")
        .setLabel("unrated")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("dequeue")
        .setLabel("dequeue")
        .setStyle(ButtonStyle.Danger),
    )

    await interaction.reply({ embeds: [emptyQueueEmbed], components: [buttonRow1, buttonRow2] });
    //if all the queues are empty then use emptyQueueEmbed
    console.log("LOG: \t embed queue");
  },
};
