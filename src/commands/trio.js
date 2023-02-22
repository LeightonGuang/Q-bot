const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const VoiceState = require("discord.js");
const fs = require('node:fs');
const globalFunctions = require('../globalFunctions.js');

let categoryId = 1074976911312289862;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trio")
    .setDescription("Select someone two people to trio with")

    .addUserOption((option) =>
      option
        .setName('member2')
        .setDescription('trio partner 1')
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName('member3')
        .setDescription('trio partner 2')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { member, guild } = interaction;
    //voiceChannel is id of queue waiting room
    let member1 = member;
    let member2 = interaction.options.getMember('member2');
    let member3 = interaction.options.getMember('member3')

    let queueWaitingRoomId = guild.channels.cache.find(channel => channel.name === "queue waiting room");

    let hasMember1 = queueWaitingRoomId.members.has(member1.id);
    let hasMember2 = queueWaitingRoomId.members.has(member2.id);
    let hasMember3 = queueWaitingRoomId.members.has(member3.id);

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2 && hasMember3) {
      let newTrioVoiceChannel = await guild.channels.create({
        name: member1.user.username + "'s trio vc",
        type: 2,
        userLimit: 3,
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
          },
          {
            id: member3,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          }
        ]
      })
      let newTrioObj = guild.channels.cache.find(channel => channel.name === member1.user.username + "'s trio vc");
      member1.voice.setChannel(newTrioObj);
      member2.voice.setChannel(newTrioObj);
      member3.voice.setChannel(newTrioObj);
      interaction.reply({ content: `${member1.user.username}, ${member2.user.username} and ${member3.user.username} moved to ${member1.user.username + "'s trio vc"}`, ephemeral: true });
      console.log("LOG: " + `${member1.user.username + "'s trio vc"} created`)

      let dataFile = fs.readFileSync('data.json');
      let dataObj = JSON.parse(dataFile);
      let customVoiceChannel = dataObj.customVoiceChannel;

      customVoiceChannel.push(member1.user.username + "'s trio vc");
      globalFunctions.writeToFile(dataObj, 'data.json');


    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};
