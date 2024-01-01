const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../writeToFile');

module.exports = async (interaction, trio1, trio2, trio3) => {

  const { member, guild } = interaction;

  let member1 = member;
  let member2 = interaction.options.getMember("trio1");
  let member3 = interaction.options.getMember("trio2");

  let queueWaitingRoomId = guild.channels.cache.get("1095136188622454916");

  let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

  const inviteRow = new ActionRowBuilder()
    .setComponents(
      new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger),
    );

  let hasMember1 = queueWaitingRoomId.members.has(trio1.id);
  let hasMember2 = queueWaitingRoomId.members.has(trio2.id);
  let hasMember3 = queueWaitingRoomId.members.has(trio3.id);

  //check if member have already sent an invite

  /*if the person who used the command and the targeted member is in queue waiting room*/
  if (hasMember1 && hasMember2 && hasMember3) {
    //write this to vcInvite
    //trio is to identify its trio for handler and last item is counter for how many accept
    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);
    let vcInvite = dataObj.vcInvite;

    await interaction.reply({ content: `invite sent to ${trio2.user.username} and ${trio3.user.username}`, ephemeral: true });
    queueNotificationChannel.send({ content: `${trio2} and ${trio3}, you got an invited from ${trio1} to a private trio vc.`, components: [inviteRow] })
      .then(interaction => {
        let trioVcObj = {
          vcType: "trio",
          inviteList: [trio1.id, trio2.id, trio3.id],
          interactionId: interaction.id,
          decision: [true, 0, 0]
        };

        vcInvite.push(trioVcObj);
        writeToFile(dataObj, 'data.json');
      })

  } else {
    await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
    console.log("LOG: \t" + "Some members are not in queue waiting room");
  }

};