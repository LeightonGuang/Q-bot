const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require('../../utils/writeToFile');
const { info } = require("node:console");

/** check for match
   * 
   * 1v1
   * 
   * if member is in queue waiting room
   * let them queue
   * 
   * if there are more than 2 people
   * check their region
   * 
   * if the region match
   * 
   * create private text channel
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

            queueNotificationChannel.send(`${member1} and ${member2}, you got a ${oneVoneRole} game`);
            console.log("Theres a match for 1v1");

            let queuesId = "1102167519583817728";
            let textChannelName = (player1Obj.tag + " vs " + player2Obj.tag + "'s lobby");
            let voiceChannelName = player1Obj.tag + " vs " + player2Obj.tag + "'s vc";

            let privateTextChannel = await guild.channels.create({
              name: textChannelName,
              type: 0,
              parent: queuesId,
              permissionOverwrites: [
                {
                  id: guild.id,
                  deny: [Discord.PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: member1,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: member2,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                }
              ]
            });

            let privateVc = await guild.channels.create({
              name: voiceChannelName,
              type: 2,
              userLimit: 2,
              parent: queuesId,
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

            let customLobby = dataObj.customLobby;

            let customVcObj = {
              textChannelId: privateTextChannel.id,
              voiceChannelId: privateVc.id,
              type: "1v1",
              region: player1Obj.region,
              playersList: [player1Obj, player2Obj],
            }

            customLobby.push(customVcObj);
            writeToFile(dataObj, "data.json");

            //send players riot id to private text Channel
            let infoEmbed = new EmbedBuilder()
              .setColor(0xFFFFFF)
              .setAuthor({ name: "Q bot" })
              .setTitle("Player Info")
              .addFields(
                { name: "Memmber", value: player1Obj.tag, inline: true },
                { name: "Riot Id", value: player1Obj.riotId, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Member", value: player2Obj.tag, inline: true },
                { name: "Riot Id", value: player2Obj.riotId, inline: true },
              )
              .setTimestamp()

            privateTextChannel.send({ embeds: [infoEmbed] });

            //move the 2 players to their vc
            member1.voice.setChannel(privateVc);
            member2.voice.setChannel(privateVc);

            //remove their names from oneVoneList
            let listOfId = [player1Id, player2Id];
            let newoneVoneList = oneVoneList.filter(id => !listOfId.includes(id));

            dataObj.oneVoneList = newoneVoneList;
            writeToFile(dataObj, "data.json");

            updateQueueEmbed(interaction);

            break outerLoop;
          }
          //not in the same region
          //console.log("LOG: \t" + "no region match");
        }
      }
    }
  }
};