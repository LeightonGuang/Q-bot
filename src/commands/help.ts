import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("list of all commands"),

  async execute(interaction) {
    const helpEmbed: EmbedBuilder = new EmbedBuilder()
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

    const helpSelectMenu: ActionRowBuilder =
      new ActionRowBuilder().setComponents(
        new StringSelectMenuBuilder()
          .setPlaceholder("sub-commands")
          .setCustomId(`help-${replyObj.id}`)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("/help")
              .setDescription("All commands available for Q bot")
              .setValue("help"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/account")
              .setDescription("Account related sub commands")
              .setValue("account"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/valorant")
              .setDescription("Valorant related sub commands")
              .setValue("valorant"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/vct")
              .setDescription("Valorant Champions Tour related sub commands")
              .setValue("vct"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/private-vc")
              .setDescription("Private vc related sub commands")
              .setValue("private-vc")
          )
      );

    interaction.editReply({ components: [helpSelectMenu.toJSON()] });
    console.log("LOG: \t embed help list");
  },
};
