import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Interaction,
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
          name: "/vct [***sub-command***]",
          value: "Commands for VCT related stuff",
        },
        {
          name: "/cs2-event [***sub-command***]",
          value: "Get any tier 1 csgo event",
        },
        { name: "/gamble [***sub-command***]", value: "Commands for gambling" },
        {
          name: "/private-vc [***sub-command***]",
          value: "Creates a private vc for you and the people you want",
        },
        {
          name: "/minecraft [***sub-command***]",
          value: "Commands for minecraft",
        },
        {
          name: "/football [***sub-command***]",
          value: "Commands for football",
        },
        { name: "/poll", value: "Make a poll" },
        { name: "/coin-flip", value: "Flip a coin" },
        { name: "/vro-font", value: "Convert your text to a vro font" },
        { name: "/ping", value: "Ping the bot to check online status" },
        { name: "/credit", value: "The people who contributed to this server" }
      )
      .setTimestamp();

    const replyObj: Interaction = await interaction.reply({
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
              .setLabel("/cs2-event")
              .setDescription("Counter Strike 2 event related sub commands")
              .setValue("cs2-event"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/gamble")
              .setDescription("Gambling related sub commands")
              .setValue("gamble"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/private-vc")
              .setDescription("Private vc related sub commands")
              .setValue("private-vc"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/minecraft")
              .setDescription("Minecraft related sub commands")
              .setValue("minecraft"),
            new StringSelectMenuOptionBuilder()
              .setLabel("/football")
              .setDescription("Football related sub commands")
              .setValue("football")
          )
      );

    interaction.editReply({ components: [helpSelectMenu.toJSON()] });
    console.log("LOG: \t embed help list");
  },
};
