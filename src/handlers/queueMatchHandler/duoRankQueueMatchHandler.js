const Discord = require("discord.js");
const fs = require("node:fs");
const writeToFile = require('../../utils/writeToFile');

/** check for match
   * 
   * duo rank
   * if there are more than 2 people
   * check their region and rank
   * 
*/

module.exports = async (interaction) => {
  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let duoRankList = dataObj.duoRankList;
  let playerList = dataObj.playerList;

  if (duoRankList.length >= 2) {

    outerLoop:
    for (let player1Id of duoRankList) {
      for (let player2Id of duoRankList) {

        //if its not comparing to itself
        if (player1Id !== player2Id) {

          //get the object of both player
          const player1Obj = playerList.find(obj => obj.id === player1Id);
          const player2Obj = playerList.find(obj => obj.id === player2Id);

          console.log("player1 region: " + player1Obj.region);
          console.log("player2 region: " + player2Obj.region);
          //check if both player are from the same region
          if (player1Obj.region === player2Obj.region) {
            let rankValue = {
              "I": 0, "B": 1,
              "S": 3, "G": 4,
              "P": 5, "D": 6,
              "A": 7, "Im": 8,
              "R": 9
            }

            let player1Rank = player1Obj.rank;
            let player2Rank = player2Obj.rank;

            console.log("player1Rank: " + player1Rank);
            let player1RankGroup = player1Rank.slice(0, -1);
            let player1RankValue = rankValue[player1RankGroup];

            let player2RankGroup = player2Rank.slice(0, -1);
            let player2RankValue = rankValue[player2RankGroup];

            let rankDiff = Math.abs(player1RankValue - player2RankValue);

            if (rankDiff <= 1) {
              //start game
              let member1 = guild.members.cache.get(player1Id);
              let member2 = guild.members.cache.get(player2Id);

              let queueNotificationChannel = guild.channels.cache.find(
                (c) => c.name === "queue-notification"
              );

              let duoRankRole = guild.roles.cache.find(
                (role) => role.name === "duo rank"
              );

              queueNotificationChannel.send(`${member1} and ${member2}, you got a match ${duoRankRole}`);
              console.log("Theres a match for duo rank");

              let categoryId = "1074976911312289862";
              let vcName = player1Obj.tag + "'s queue";

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

              break outerLoop;
            }
            //else rank diff too high
          }
        }
      }
    }
  }
};