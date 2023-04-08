const Discord = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../utils/writeToFile');
const interactionHandler = require("./interactionHandler");

module.exports = async (interaction, playerList) => {
  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let categoryId = "1074976911312289862";

  let playerListSize = playerList.length;

  /**
   * create a private vc
   * 
   * 
   */

  let vcName = playerList[0].tag + "'s queue";

  let createPrivateVc = await guild.channels.create({
    name: vcName,
    type: 2,
    userLimit: playerListSize,
    parent: categoryId,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [Discord.PermissionsBitField.Flags.Connect],
      }
    ]
  });

  let customVoiceChannel = dataObj.customVoiceChannel;
  customVoiceChannel.push(vcName);
  writeToFile(dataObj, "data.json");

  //loop through player list and set the permission 
  for (let player of playerList) {

  }

  //move the 2 players
  let member1 = guild.members.cache.get(playerList[0].id);
  let member2 = guild.members.cache.get(playerList[1].id);

  member1.voice.setChannel(createPrivateVc);
  member2.voice.setChannel(createPrivateVc);
};