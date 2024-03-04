import { EmbedBuilder } from "discord.js";

const votedMembers = new Set();

export const handler = async (interaction) => {
  console.log("FILE: \t" + "pollButtons.js");

  if (!interaction.isButton()) return console.log("no button pressed");

  //poll-yes-[id]
  const splittedArray: string[] = interaction.customId.split("-");
  //if button pressed is not a poll button
  if (splittedArray[0] !== "poll") return;

  const pollEmbed: any = interaction.message.embeds[0];
  if (!pollEmbed) return;

  const numAns: number = pollEmbed.fields.length;
  const answers: string[] = [];

  for (let i = 0; i < numAns; i++) {
    let buttonComponent = interaction.message.components[0];
    let ans = buttonComponent.components[i].customId.split("-")[1];
    answers.push(ans);
  }

  for (let i = 0; i < numAns; i++) {
    if (
      votedMembers.has(`${interaction.user.id}-${interaction.message.id}`) &&
      splittedArray[1] === answers[i]
    ) {
      //if Set() votedmembers has [user.id]-[message.id] and button pressed is one of the answers
      return await interaction.reply({
        content: "You've already voted",
        ephemeral: true,
      });
    }
  }

  //add the user id and message id to votedMembers Set()
  votedMembers.add(`${interaction.user.id}-${interaction.message.id}`);

  for (let i = 0; i < numAns; i++) {
    const buttonPressedAnswer: string = interaction.customId.split("-")[1];

    const memberPressedEnd: string = interaction.message.embeds[0].author.name;

    console.log("user.tag: " + interaction.user.tag);
    console.log("memberPressedEnd: " + memberPressedEnd);

    if (buttonPressedAnswer === "end") {
      //if end poll button is pressed remove buttons and change colour
      if (interaction.user.tag === memberPressedEnd) {
        //if the member pressed end poll is the creator of the poll
        console.log("LOG: \t" + "end poll button pressed");
        await interaction.reply({
          content: "You ended the poll",
          ephemeral: true,
        });

        const newPollEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x808080)
          .setAuthor(pollEmbed.author)
          .setTitle("Poll Ended")
          .setDescription(pollEmbed.description)
          .setFields(pollEmbed.fields)
          .setTimestamp();

        interaction.message.edit({ embeds: [newPollEmbed], components: [] });
      } else {
        await interaction.reply({
          content: "Only poll creator can end poll",
          ephemeral: true,
        });
      }

      break;
    } else if (buttonPressedAnswer === answers[i]) {
      //if button pressed is one of the answers in the list
      console.log("LOG: \t" + `[${answers[i]}] button pressed`);

      const count: any = pollEmbed.fields[i];
      const newCount: number = parseInt(count.value) + 1;
      count.value = newCount;

      const votedReply: string = "vote submitted";

      await interaction.reply({ content: votedReply, ephemeral: true });
      interaction.message.edit({ embeds: [pollEmbed] });

      break;
    }
  }
};
