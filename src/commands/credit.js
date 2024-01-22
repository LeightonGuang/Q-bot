const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("credit")
    .setDescription("Thank you to all the people that helped"),
  async execute(interaction) {
    let creditEmbed = new EmbedBuilder()
      .setColor(0xffd700)
      .setAuthor({ name: "Q bot" })
      .setTitle("Credit")
      .setDescription("Thank you to the people that helped made Q bot")
      .addFields({
        name: "<:Pog:1139840279659159582>",
        value: "<@691784137790717984>",
      })
      .setTimestamp();

    interaction.reply({ embeds: [creditEmbed] });
  },
};
