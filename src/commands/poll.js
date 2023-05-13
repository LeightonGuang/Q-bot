const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction } = require('discord.js');

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

    console.log("answers:" + answers);

    let numAns = answers.length;

    let pollEmbed = new EmbedBuilder()
      .setColor(0xFFFF00)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTitle("Poll")
      .addFields()
      .setDescription("Question: " + question)
      .setTimestamp()

    console.log("pollEmbed: " + JSON.stringify(pollEmbed));


    let newFieldList = [];
    for (let i = 0; i < numAns; i++) {
      let newField = { name: `${answers[i]}: `, value: "0", inline: true };
      newFieldList.push(newField);
    }

    //console.log("newFieldList: " + JSON.stringify(newFieldList));

    pollEmbed.addFields(newFieldList);

    //console.log("pollEmbed: " + JSON.stringify(pollEmbed));

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
    )

    const endPollRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel("end poll")
        .setCustomId("poll-end")
        .setStyle(ButtonStyle.Secondary),
    )

    interaction.editReply({ components: [voteRow, endPollRow] });

  }
};
