const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands"),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "R0ADX B0T" })
      .setTitle("HELP")
      .setDescription("list of commands available for R0ADX B0T\n vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
      .addFields(
        { name: "/status", value: "Bot online status" },
        { name: "/roll", value: "Roll a random number from 1 to a specific number by you" },
        { name: "/rock-paper-scissors", value: "Rock paper scissors game" },
        { name: "/spam-ping", value: "Ping a user 10 times" },
        { name: "/ghost-ping", value: "Ping a user without the tag showing" },
        { name: "/schedule-message date", value: "schedule a message by date" },
        { name: "/schedule-message timer", value: "schedule a message with a timer" },
        { name: "/tag", value: "Tag like cheese touch" },
        { name: "/creator", value: "Creator of R0ADX B0T" },
      )
      .setTimestamp()
      .setFooter({ text: "R0ADX B0T" })
    await interaction.reply({ embeds: [helpEmbed] });
    console.log("LOG: \t embed help list");
  },
};
