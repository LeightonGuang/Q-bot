const Discord = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require('../../utils/writeToFile');

/** check for match
   * 
   * 1v1
   * if there are more than 2 people
   * check their region
   * 
   * if the region match
   * 
   * create private vc
   * move both player to private vc
   * 
   * remove their names from queue embed
   * 
*/

module.exports = async (interaction) => {

  //=============================Start=========================

  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let oneVoneList = dataObj.oneVoneList;
  let playerList = dataObj.playerList;

  if (oneVoneList.length >= 2) {

    outerLoop:
    for (let player1Id of oneVoneList) {
      for (let player2Id of oneVoneList) {

        //if its not comparing to itself
        if (player1Id !== player2Id) {

          //get the object of both player
          const player1Obj = playerList.find(obj => obj.id === player1Id);
          const player2Obj = playerList.find(obj => obj.id === player2Id);

          //check if both player are from the same region
          if (player1Obj.region === player2Obj.region) {

            //create private vc

            let member1 = guild.members.cache.get(player1Id);
            let member2 = guild.members.cache.get(player2Id);

            let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

            let oneVoneRole = guild.roles.cache.find(
              (role) => role.name === "1v1"
            );

            queueNotificationChannel.send(`${member1} and ${member2}, you got a 1v1 game ${oneVoneRole}`);
            console.log("Theres a match for 1v1");

            let categoryId = "1074976911312289862";
            let vcName = player1Obj.tag + " vs " + player2Obj.tag;

            let createPrivateVc = await guild.channels.create({
              name: vcName,
              type: 2,
              userLimit: 2,
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
              ]
            });

            let customVoiceChannel = dataObj.customVoiceChannel;
            customVoiceChannel.push(vcName);
            writeToFile(dataObj, "data.json");

            //move the 2 players to their vc
            member1.voice.setChannel(createPrivateVc);
            member2.voice.setChannel(createPrivateVc);

            //remove their names from oneVoneList
            let listOfId = [player1Id, player2Id];
            let newoneVoneList = oneVoneList.filter(id => !listOfId.includes(id));

            dataObj.oneVoneList = newoneVoneList;
            writeToFile(dataObj, "data.json");

            updateQueueEmbed(interaction);

            break outerLoop;
          }
          //not in the same region
        }
      }
    }
  }
};