const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../writeToFile');

module.exports = async (interaction, duo1, duo2) => {

  const { member, guild } = interaction;

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

  let hasMember1 = queueWaitingRoomId.members.has(duo1.id);
  let hasMember2 = queueWaitingRoomId.members.has(duo2.id);

  //check if member have already sent an invite

  /*if the person who used the command and the targeted member is in queue waiting room*/
  if (hasMember1 && hasMember2) {
    //write this to vcInvite
    //duo is to identify its duo for handler and last item is counter for how many accept
    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);
    let vcInvite = dataObj.vcInvite;

    await interaction.reply({ content: "invite sent to " + duo2.user.username, ephemeral: true });
    queueNotificationChannel.send({ content: `${duo2}, you got an invite from ${duo1} to private duo vc`, components: [inviteRow] })
      .then(interaction => {
        let duoVcObj = {
          vcType: "duo",
          inviteList: [duo1.id, duo2.id],
          interactionId: interaction.id,
          decision: false
        };

        vcInvite.push(duoVcObj);
        writeToFile(dataObj, 'data.json');
      })

  } else {
    await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
    console.log("LOG: \t" + "Some members are not in queue waiting room");
  }

};