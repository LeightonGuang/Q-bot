const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("make a poll")
    .addSubcommand(subcommand =>
      subcommand
        .setName("yes-no-poll")
        .setDescription("poll for yes and no")
        .addStringOption((option) =>
          option
            .setName("poll")
            .setDescription("poll question for yes and no")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("multiple-choice-poll")
        .setDescription("poll for multiple choice")
        .addStringOption((option) =>
          option
            .setName("poll")
            .setDescription("poll question for multiple choice")
            .setRequired(true)
        )
    ),

  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    console.log("FILE: \t" + "poll.js");
    let subCommand = interaction.options.getSubcommand();

    if (subCommand === "yes-no-poll") {
      let question = interaction.options.getString("poll");

      const pollEmbed = new EmbedBuilder()
        .setAuthor({ name: "Poll" })
        .setTitle(question)
        .setFields([
          { name: "Yes: ", value: "0", inline: true },
          { name: "No: ", value: "0", inline: true },
        ])
        .setTimestamp()
        .setColor(0xFFFF00)

      const replyObj = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

      const voteRow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setLabel("yes")
          .setCustomId(`poll-yes-${replyObj.id}`)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setLabel("no")
          .setCustomId(`poll-no-${replyObj.id}`)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setLabel("end poll")
          .setCustomId("poll-end")
          .setStyle(ButtonStyle.Secondary),
      )

      interaction.editReply({ components: [voteRow] });

    } else if (subCommand === "multiple-choice-poll") {

    }
  }
};
