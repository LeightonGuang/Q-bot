const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands")
  ,

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0xffffff)
      .setAuthor({ name: "Q bot" })
      .setTitle("/help")
      .setDescription("All the commands that are available to use in the server")
      .addFields(
        { name: "/ping", value: "Ping the bot to check online status" },
        { name: "/setup", value: "Create roles for queue" },
        { name: "/creator", value: "Creator of Q Bot" },
        { name: "/duo, /trio, /quad, /stack ", value: "Creates a private vc for you and the people you want" }
      )
      .setTimestamp()

    const replyObj = await interaction.reply({ embeds: [helpEmbed], fetchReply: true });

    const helpSelectMenu = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder("sub-commands")
          .setCustomId(`help-${replyObj.id}`)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("/help")
              .setDescription("All the commands that are available to use in the server")
              .setValue("help"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/account")
              .setDescription("Sub commands that is used to manage your account")
              .setValue("account"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/valorant")
              .setDescription("Sub commands that are valorant related")
              .setValue("valorant")
          )
      );

    interaction.editReply({ components: [helpSelectMenu.toJSON()] });


    console.log("LOG: \t embed help list");
  },
};
