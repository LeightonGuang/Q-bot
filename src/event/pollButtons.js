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

  //member has already voted and the button is yes or no
  if (votedMembers.has(`${interaction.user.id}-${interaction.message.id}`) && (splittedArray[1] === "yes" || splittedArray[1] === "no")) {
    return await interaction.reply({ content: "You've already voted", ephemeral: true });
  }

  //add the user id to votedMembers Set()
  votedMembers.add(`${interaction.user.id}-${interaction.message.id}`);

  const pollEmbed = interaction.message.embeds[0];
  if (!pollEmbed) return;

  const yesField = pollEmbed.fields[0];
  const noField = pollEmbed.fields[1];

  const votedReply = "You voted";

  switch (splittedArray[1]) {

    //yes button pressed
    case "yes": {
      console.log("LOG: \t" + "yes button pressed");
      const newYesCount = parseInt(yesField.value) + 1;
      yesField.value = newYesCount;

      await interaction.reply({ content: votedReply, ephemeral: true });
      interaction.message.edit({ embeds: [pollEmbed] });
    }
      break;

    //no button pressed
    case "no": {
      console.log("LOG: \t" + "no button pressed");
      const newNoCount = parseInt(noField.value) + 1;
      noField.value = newNoCount;

      await interaction.reply({ content: votedReply, ephemeral: true });
      interaction.message.edit({ embeds: [pollEmbed] });
    }
      break;

    //end button pressed
    case "end": {
      console.log("LOG: \t" + "end poll button pressed");
      console.log(pollEmbed);

      await interaction.reply({ content: "You ended the poll", ephemeral: true });

      let newPollEmbed = new EmbedBuilder()
        .setAuthor({ name: "Poll Ended" })
        .setTitle(pollEmbed.title)
        .setFields(pollEmbed.fields)
        .setTimestamp()
        .setColor(0x808080)

      interaction.message.edit({ embeds: [newPollEmbed], components: [] });
      console.log(newPollEmbed);
    }
      break;
  }
}