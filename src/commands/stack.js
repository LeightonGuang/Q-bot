const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const fs = require('node:fs');
const globalFunctions = require('../globalFunctions.js');

let categoryId = "1074976911312289862";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stack")
    .setDescription("Select someone four people to 5 stack with")

    .addUserOption((option) =>
      option
        .setName('member2')
        .setDescription('5 stack partner 1')
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName('member3')
        .setDescription('5 stack partner 2')
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName('member4')
        .setDescription('5 stack partner 3')
        .setRequired(true)
    )

    .addUserOption((option) =>
      option
        .setName('member5')
        .setDescription('5 stack partner 4')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { member, guild } = interaction;
    //voiceChannel is id of queue waiting room
    let member1 = member;
    let member2 = interaction.options.getMember('member2');
    let member3 = interaction.options.getMember('member3');
    let member4 = interaction.options.getMember('member4');
    let member5 = interaction.options.getMember('member5');

    let queueWaitingRoomId = guild.channels.cache.find(channel => channel.name === "queue waiting room");

    let hasMember1 = queueWaitingRoomId.members.has(member1.id);
    let hasMember2 = queueWaitingRoomId.members.has(member2.id);
    let hasMember3 = queueWaitingRoomId.members.has(member3.id);
    let hasMember4 = queueWaitingRoomId.members.has(member4.id);
    let hasMember5 = queueWaitingRoomId.members.has(member5.id);

    /*if the person who used the command and the targeted member is in queue waiting room*/
    if (hasMember1 && hasMember2 && hasMember3 && hasMember4 && hasMember5) {
      let newStackVoiceChannel = await guild.channels.create({
        name: member1.user.username + "'s 5 stack vc",
        type: 2,
        userLimit: 5,
        parent: categoryId,
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
          },
          {
            id: member4,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          },
          {
            id: member5,
            allow: [Discord.PermissionsBitField.Flags.Connect],
          }
        ]
      })
      let newStackObj = guild.channels.cache.find(channel => channel.name === member1.user.username + "'s 5 stack vc");
      member1.voice.setChannel(newStackObj);
      member2.voice.setChannel(newStackObj);
      member3.voice.setChannel(newStackObj);
      member4.voice.setChannel(newStackObj);
      member5.voice.setChannel(newStackObj);
      interaction.reply({ content: `${member1.user.username}, ${member2.user.username}, ${member3.user.username}, ${member4.user.username} and ${member5.user.username} moved to ${member1.user.username + "'s stack vc"}`, ephemeral: true });
      console.log("LOG: \t" + `${member1.user.username + "'s 5 stack vc"} created`);

      let dataFile = fs.readFileSync('data.json');
      let dataObj = JSON.parse(dataFile);
      let customVoiceChannel = dataObj.customVoiceChannel;

      customVoiceChannel.push(member1.user.username + "'s 5 stack vc");
      globalFunctions.writeToFile(dataObj, 'data.json');


    } else {
      await interaction.reply({ content: "Some members are not in queue waiting room", ephemeral: true });
      console.log("LOG: \t" + "Some members are not in queue waiting room");
    }
  },
};
