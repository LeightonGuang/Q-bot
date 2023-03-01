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
        { name: "/ping", value: "ping the bot to check online status" },
        { name: "/setup", value: "Create roles for queue" },
        { name: "/creator", value: "Creator of Q Bot" },
        { name: "/player-profile", value: "Setup player information" },
        { name: "/duo, /trio, /squad ", value: "Creates a private vc for you and the people you want" }
      )
      .setTimestamp()
      .setFooter({ text: "Q bot" })
      .setColor(0xFFFFFF)
    await interaction.reply({ embeds: [helpEmbed] });
    console.log("LOG: \t embed help list");
  },
};
