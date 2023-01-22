const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands"),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "Q bot" })
      .setTitle("HELP")
      .setDescription("list of commands available for Q bot\n vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
      .addFields(
        { name: "/online", value: "Bot online status" },
        { name: "/setup", value: "Create roles for queue" },
        { name: "/creator", value: "Creator of R0ADX B0T" }
      )
      .setTimestamp()
      .setFooter({ text: "Q bot" })
    await interaction.reply({ embeds: [helpEmbed] });
    console.log("LOG: \t embed help list");
  },
};
