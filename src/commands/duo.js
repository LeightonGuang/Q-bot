const { SlashCommandBuilder, GatewayIntentBits, User, VoiceChannel } = require('discord.js');
const Discord = require('discord.js');
//const client = require('../index.js');

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
    //voiceChannel is id of queue waiting room
    let member1id = interaction.member;
    let member2id = interaction.options.getMember('duo');

    let queueWaitingRoomObj = interaction.guild.channels.cache.find(channel => channel.name === "queue waiting room");

    const members = queueWaitingRoomObj.members;
    //console.log("members: " + members);
    let membersInChannel = queueWaitingRoomObj.members;
    //console.log("membersInChannel: " + membersInChannel);

    console.log("category: " + interaction.channel);
    let categoryId = 1074976911312289862;

    if (true/*if the person who used the command and the targeted member is in queue waiting room*/) {
      let newDuoVoiceChannel = interaction.guild.channels.create({
        name: member1id.user.username + "'s duo vc",
        type: 2,
        userLimit: 2,
        parent: categoryId,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
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
      let newDuoObj = interaction.guild.channels.cache.find(channel => channel.name === member1id.user.username + "'s duo vc");
      member1id.voice.setChannel(newDuoObj);
      member2id.voice.setChannel(newDuoObj);
      await interaction.reply({ content: `${member1id.user.username + "'s duo vc"} created`, ephemeral: true });
      console.log("LOG: " + `${member1id.user.username + "'s duo vc"} created`)

    } else {
      await interaction.reply("no vc created");
      console.log("no member is moved");
    }

  },
};
