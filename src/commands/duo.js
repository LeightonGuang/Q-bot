const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const VoiceState = require("discord.js");

let categoryId = 1074976911312289862;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duo")
    .setDescription("Select someone to duo with")
    .addUserOption((option) =>
      option
        .setName('duo')
        .setDescription('duo partner')
        .setRequired(true)),

  async execute(interaction) {
    const { member, guild } = interaction;
    //voiceChannel is id of queue waiting room
    let member1 = member;
    let member2 = interaction.options.getMember('duo');
    console.log("member1: " + member1);

    let queueWaitingRoomId = guild.channels.cache.find(channel => channel.name === "queue waiting room");
    console.log("queueWaitingRoom: " + queueWaitingRoomId);

    let hasMember1 = queueWaitingRoomId.members.has(member1.id);
    console.log("hasMember1: " + hasMember1);
    let hasMember2 = queueWaitingRoomId.members.has(member2.id);
    console.log("hasMember2: " + hasMember2);

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2) {
      let newDuoVoiceChannel = await guild.channels.create({
        name: member1.user.username + "'s duo vc",
        type: 2,
        userLimit: 2,
        parentID: categoryId,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [Discord.PermissionsBitField.Flags.Connect],
          },
          {
            id: member1,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          },
          {
            id: member2,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          }
        ]
      })
      let newDuoObj = guild.channels.cache.find(channel => channel.name === member1.user.username + "'s duo vc");
      member1.voice.setChannel(newDuoObj);
      member2.voice.setChannel(newDuoObj);
      interaction.reply({ content: `${member1.user.username} and ${member2.user.username} moved to ${member1.user.username + "'s duo vc"}`, ephemeral: true });
      console.log("LOG: " + `${member1.user.username + "'s duo vc"} created`)

    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};
