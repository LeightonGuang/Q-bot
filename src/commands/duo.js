const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const VoiceState = require("discord.js");

let categoryId = 1074976911312289862;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Select someone to duo with")
    .addUserOption((option) =>
      option
        .setName('duo')
        .setDescription('duo partner')
        .setRequired(true)),

  async execute(interaction) {
    const { member, guild } = interaction;
    //voiceChannel is id of queue waiting room
    let member1id = member;
    let member2id = interaction.options.getMember('duo');

    let queueWaitingRoomId = guild.channels.cache.find(channel => channel.name === "queue waiting room");
    console.log("queueWaitingRoom: " + queueWaitingRoomId);

    let hasMembers = queueWaitingRoomId.members.some(member => member.id === member1id.id || member.id === member2id.id);
    console.log("output: " + hasMembers);

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMembers) {
      let newDuoVoiceChannel = await guild.channels.create({
        name: member1id.user.username + "'s duo vc",
        type: 2,
        userLimit: 2,
        parentID: categoryId,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [Discord.PermissionsBitField.Flags.Connect],
          },
          {
            id: member1id,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          },
          {
            id: member2id,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          }
        ]
      })
      let newDuoObj = guild.channels.cache.find(channel => channel.name === member1id.user.username + "'s duo vc");
      member1id.voice.setChannel(newDuoObj);
      member2id.voice.setChannel(newDuoObj);
      interaction.reply({ content: `${member1id.user.username} and ${member2id.user.username} moved to ${member1id.user.username + "'s duo vc"}`, ephemeral: true });
      console.log("LOG: " + `${member1id.user.username + "'s duo vc"} created`)

    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};
