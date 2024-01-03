const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands"),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0xffffff)
      .setAuthor({ name: "Q bot" })
      .setTitle("/help")
      .setDescription(
        "All the commands that are available to use in the server"
      )
      .addFields(
        {
          name: "/account [***sub-command***]",
          value: "Set up and manage your accounts",
        },
        {
          name: "/valorant [***sub-command***]",
          value: "Commands for Valorant related stuff",
        },
        {
          name: "/private-vc [***sub-command***]",
          value: "Creates a private vc for you and the people you want",
        },
        { name: "/ping", value: "Ping the bot to check online status" },
        { name: "/credit", value: "The people who contributed to this server" }
      )
      .setTimestamp();

    const replyObj = await interaction.reply({
      embeds: [helpEmbed],
      fetchReply: true,
    });

    const helpSelectMenu = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setPlaceholder("sub-commands")
        .setCustomId(`help-${replyObj.id}`)
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("/help")
            .setDescription(
              "All the commands that are available to use in the server"
            )
            .setValue("help"),
          new StringSelectMenuOptionBuilder()
            .setLabel("/account")
            .setDescription("Sub commands that is used to manage your account")
            .setValue("account"),
          new StringSelectMenuOptionBuilder()
            .setLabel("/valorant")
            .setDescription("Sub commands that are valorant related")
            .setValue("valorant"),
          new StringSelectMenuOptionBuilder()
            .setLabel("/private-vc")
            .setDescription("Sub commands that creates private vc")
            .setValue("private-vc")
        )
    );

    interaction.editReply({ components: [helpSelectMenu.toJSON()] });

    console.log("LOG: \t embed help list");
  },
};
