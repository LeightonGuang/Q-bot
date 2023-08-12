const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands")
  ,

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0xffffff)
      .setAuthor({ name: "Q bot" })
      .setTitle("HELP")
      .setDescription("list of commands available for Q bot")
      .addFields(
        { name: "/ping", value: "Ping the bot to check online status" },
        { name: "/setup", value: "Create roles for queue" },
        { name: "/creator", value: "Creator of Q Bot" },
        { name: "/duo, /trio, /quad, /stack ", value: "Creates a private vc for you and the people you want" }
      )
      .setTimestamp()

    const replyObj = await interaction.reply({ embeds: [helpEmbed], fetchReply: true });

    const helpSelectMenu = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder().setCustomId(`help-${replyObj.id}`).setOptions([
        { label: "/help", value: "help" },
        { label: "/account", value: "account" },
        { label: "/valorant", value: "valorant" }
      ])
    );

    interaction.editReply({ components: [helpSelectMenu.toJSON()] });


    console.log("LOG: \t embed help list");
  },
};
