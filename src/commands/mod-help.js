const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod-help")
    .setDescription("command for mods"),

  async execute(interaction) {
    const modHelpEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("MOD COMMAND")
      .setDescription("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
      .addFields(
        { name: "/mod", value: "commands for mod" },
        { name: "/mod clear-queue", value: "clear all the queue in data.json" },
        { name: "/mod clear-channel", value: "delete all messages in a channel" },
        { name: "/mod announcement", value: "send announcement to a sepcific channel" },
      )
      .setTimestamp()
      .setColor(0xe900ff)
    await interaction.reply({ embeds: [modHelpEmbed] });
    console.log("LOG: \t" + "embed mod-help list");
  },
};
