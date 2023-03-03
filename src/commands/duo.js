const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duo")
    .setDescription("Select someone to duo with")
    .addUserOption((option) => option.setName("duo").setDescription("duo partner").setRequired(true)),

  async execute(interaction) {
    const { member, guild } = interaction;

    let member1 = member;
    let member2 = interaction.options.getMember("duo");

    let queueWaitingRoomId = guild.channels.cache.find((channel) => channel.name === "queue waiting room");

    let queueNotificationChannel = guild.channels.cache.find(
      (c) => c.name === "queue-notification"
    );

    const inviteEmbed = new EmbedBuilder()
      .setTitle("Private Duo VC invite")
      .setDescription(`${member2}, you got an invited from ${member1}`)
      .setTimestamp()
      .setColor("0x00FF00");

    const inviteRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger),
    );

    let hasMember1 = queueWaitingRoomId.members.has(member1.id);
    let hasMember2 = queueWaitingRoomId.members.has(member2.id);

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2) {
      //write this to vcInvite
      //duo is to identify its duo for handler and last item is counter for how many accept
      let dataFile = fs.readFileSync('data.json');
      let dataObj = JSON.parse(dataFile);
      let vcInvite = dataObj.vcInvite;

      let duoVcObj = {
        type: "duo",
        inviteList: [member1.id, member2.id],
        interactionId: interaction.id
      };

      vcInvite.push(duoVcList);
      writeToFile(dataObj, 'data.json');

      await interaction.reply({ content: "invite sent to " + member2.user.username, ephemeral: true });
      queueNotificationChannel.send({ content: `${member2}, you got an invite from ${member1} to private duo vc`, components: [inviteRow] });

    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};