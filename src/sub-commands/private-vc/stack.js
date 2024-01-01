const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stack")
    .setDescription("Select someone to stack with")
    .addUserOption((option) =>
      option
        .setName("stack1")
        .setDescription("stack1")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("stack2")
        .setDescription("stack2")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("stack3")
        .setDescription("stack3")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("stack4")
        .setDescription("stack4")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { member, guild } = interaction;

    let member1 = member;
    let member2 = interaction.options.getMember("stack1");
    let member3 = interaction.options.getMember("stack2");
    let member4 = interaction.options.getMember("stack3");
    let member5 = interaction.options.getMember("stack4");

    let queueWaitingRoomId = guild.channels.cache.find((channel) => channel.name === "queue waiting room");

    let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

    const inviteEmbed = new EmbedBuilder()
      .setTitle("Private Stack VC invite")
      .setDescription(`${member2}, ${member3}, ${member4} and ${member5}, you got an invited from ${member1}`)
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
    let hasMember5 = queueWaitingRoomId.members.has(member5.id);

    //check if member have already sent an invite

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2 && hasMember3 && hasMember4 && hasMember5) {
      //write this to vcInvite
      //stack is to identify its stack for handler and last item is counter for how many accept
      let dataFile = fs.readFileSync('data.json');
      let dataObj = JSON.parse(dataFile);
      let vcInvite = dataObj.vcInvite;

      await interaction.reply({ content: `invite sent to ${member2.user.username} and ${member3.user.username}`, ephemeral: true });
      queueNotificationChannel.send({ content: `${member2}, ${member3}, ${member4} and ${member5}, you got an invited from ${member1} to a private stack vc.`, components: [inviteRow] })
        .then(interaction => {
          let stackVcObj = {
            vcType: "stack",
            inviteList: [member1.id, member2.id, member3.id, member4.id, member5.id],
            interactionId: interaction.id,
            decision: [true, 0, 0, 0, 0]
          };

          vcInvite.push(stackVcObj);
          writeToFile(dataObj, 'data.json');
        })

    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};