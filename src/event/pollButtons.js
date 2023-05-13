const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const poll = require("../commands/poll");

const votedMembers = new Set();

module.exports = async (interaction) => {
  name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    console.log("FILE: \t" + "pollButtons.js");

  if (!interaction.isButton()) return console.log("no button pressed");

  //poll-yes-[id]
  const splittedArray = interaction.customId.split('-');
  //if button pressed is not a poll button 
  if (splittedArray[0] !== "poll") return console.log("not a poll button");

  const pollEmbed = interaction.message.embeds[0];
  if (!pollEmbed) return;


  let numAns = pollEmbed.fields.length;
  let answers = [];

  for (let i = 0; i < numAns; i++) {
    let buttonComponent = interaction.message.components[0];
    let ans = buttonComponent.components[i].customId.split('-')[1];
    answers.push(ans);
  }

  //member has already voted and the button is yes or no

  //use for loop to check 
  for (let i = 0; i < numAns; i++) {
    if (votedMembers.has(`${interaction.user.id}-${interaction.message.id}`) && (splittedArray[1] === answers[i])) {
      //if Set() votedmembers has [user.id]-[message.id] and button pressed is one of the answers
      return await interaction.reply({ content: "You've already voted", ephemeral: true });
    }
  }

  //add the user id and message id to votedMembers Set()
  votedMembers.add(`${interaction.user.id}-${interaction.message.id}`);

  for (let i = 0; i < numAns; i++) {
    let buttonPressedAnswer = interaction.customId.split('-')[1];

    if (buttonPressedAnswer === "end") {
      //if end poll button is pressed remove buttons and change colour
      console.log("LOG: \t" + "end poll button pressed");

      await interaction.reply({ content: "You ended the poll", ephemeral: true });

      let newPollEmbed = new EmbedBuilder()
        .setColor(0x808080)
        .setAuthor(pollEmbed.author)
        .setTitle("Poll Ended")
        .setDescription(pollEmbed.description)
        .setFields(pollEmbed.fields)
        .setTimestamp()

      interaction.message.edit({ embeds: [newPollEmbed], components: [] });

      break;

    } else if (buttonPressedAnswer === answers[i]) {
      //if button pressed is one of the answers in the list
      console.log("LOG: \t" + `[${answers[i]}] button pressed`);

      let count = pollEmbed.fields[i];
      const newCount = parseInt(count.value) + 1;
      count.value = newCount;

      const votedReply = "vote submitted";

      await interaction.reply({ content: votedReply, ephemeral: true });
      interaction.message.edit({ embeds: [pollEmbed] });

      break;
    }
  }
}