const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quad")
    .setDescription("Select someone to quad with")
    .addUserOption((option) =>
      option
        .setName("quad1")
        .setDescription("quad1")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("quad2")
        .setDescription("quad2")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("quad3")
        .setDescription("quad3")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { member, guild } = interaction;

    let member1 = member;
    let member2 = interaction.options.getMember("quad1");
    let member3 = interaction.options.getMember("quad2");
    let member4 = interaction.options.getMember("quad3");

    let queueWaitingRoomId = guild.channels.cache.find((channel) => channel.name === "queue waiting room");

    let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

    const inviteEmbed = new EmbedBuilder()
      .setTitle("Private Quad VC invite")
      .setDescription(`${member2}, ${member3} and ${member4}, you got an invited from ${member1}`)
      .setTimestamp()
      .setColor("0x00FF00");

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

    let hasMember1 = queueWaitingRoomId.members.has(member1.id);
    let hasMember2 = queueWaitingRoomId.members.has(member2.id);
    let hasMember3 = queueWaitingRoomId.members.has(member3.id);
    let hasMember4 = queueWaitingRoomId.members.has(member4.id);

    //check if member have already sent an invite

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2 && hasMember3 && hasMember4) {
      //write this to vcInvite
      //quad is to identify its quad for handler and last item is counter for how many accept
      let dataFile = fs.readFileSync('data.json');
      let dataObj = JSON.parse(dataFile);
      let vcInvite = dataObj.vcInvite;

      await interaction.reply({ content: `invite sent to ${member2.user.username} and ${member3.user.username}`, ephemeral: true });
      queueNotificationChannel.send({ content: `${member2}, ${member3} and ${member4}, you got an invited from ${member1} to a private quad vc.`, components: [inviteRow] })
        .then(interaction => {
          let quadVcObj = {
            vcType: "quad",
            inviteList: [member1.id, member2.id, member3.id, member4.id],
            interactionId: interaction.id,
            decision: [true, 0, 0, 0]
          };

          vcInvite.push(quadVcObj);
          writeToFile(dataObj, 'data.json');
        })

    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};