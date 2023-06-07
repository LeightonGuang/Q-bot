const Discord = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../utils/writeToFile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open-lobby")
    .setDescription("an open lobby that anyone can join"),

  async execute(interaction) {
    const { member, guild } = interaction;

    let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

    let dataFile = fs.readFileSync('data.json');
    let dataObj = JSON.parse(dataFile);

    let queuesId = "1102167519583817728";

    let textChannelName = member.user.tag + "'s open Lobby";
    let vcName = member.user.tag + "'s open lobby vc";

    let publicOpenLobbyTextChannel = await guild.channels.create({
      name: textChannelName,
      type: 0,
      parent: queuesId,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [Discord.PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    let publicOpenLobbyVc = await guild.channels.create({
      name: vcName,
      type: 2,
      parent: queuesId,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [Discord.PermissionsBitField.Flags.Connect]
        }
      ]
    });

    //move member to their open lobby
    member.voice.setChannel(publicOpenLobbyVc);

    let openLobbyObj = {
      type: "open lobby",
      textChannelId: publicOpenLobbyTextChannel.id,
      voiceChannelId: publicOpenLobbyVc.id,
    }

    let customLobby = dataObj.customLobby;
    customLobby.push(openLobbyObj);
    writeToFile(dataObj, "data.json");

    await interaction.reply({ content: "You have started an open lobby", ephemeral: true });
    queueNotificationChannel.send({ content: `${member} started an open lobby` });
  },
};