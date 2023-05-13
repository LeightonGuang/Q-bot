const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction, ActionRow } = require('discord.js');

/**
 * check if there are any duplicate answers
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("make a poll")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("question")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-1")
        .setDescription("answer 1")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-2")
        .setDescription("answer 2")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("answer-3")
        .setDescription("answer 3")
    )
    .addStringOption((option) =>
      option
        .setName("answer-4")
        .setDescription("answer 4")
    )
  ,

  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    console.log("FILE: \t" + "poll.js");

    let question = interaction.options.getString("question");
    let answers = [
      interaction.options.getString("answer-1"),
      interaction.options.getString("answer-2"),
      interaction.options.getString("answer-3"),
      interaction.options.getString("answer-4")
    ];

    answers = answers.filter(ans => ans != null);

    let uniqueAnswers = new Set(answers);
    if (uniqueAnswers.size !== answers.length) {
      //check if there are any duplicate answers entered
      console.log("LOG: \t" + "there are duplicate answers");
      await interaction.reply({ content: "Please do not enter duplicate answers", ephemeral: true });
      return;
    }

    let numAns = answers.length;

    let pollEmbed = new EmbedBuilder()
      .setColor(0xFFFF00)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTitle("Poll")
      .addFields()
      .setDescription("Question: " + question)
      .setTimestamp()

    let newFieldList = [];
    for (let i = 0; i < numAns; i++) {
      let newField = { name: `${answers[i]}: `, value: "0", inline: true };
      newFieldList.push(newField);
    }

    pollEmbed.addFields(newFieldList);

    const replyObj = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

    const voteRow = new ActionRowBuilder()

    for (let i = 0; i < numAns; i++) {
      voteRow.addComponents(
        new ButtonBuilder()
          .setLabel(answers[i])
          .setCustomId(`poll-${answers[i]}-${replyObj.id}`)
          .setStyle(ButtonStyle.Primary)
      )
    }

    const endPollRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel("end poll")
        .setCustomId("poll-end")
        .setStyle(ButtonStyle.Secondary),
    )

    interaction.editReply({ components: [voteRow, endPollRow] });
  }
};
