const Discord = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require('../../utils/writeToFile');

/** check for match
   * 
   * duo rank
   * if there are more than 2 people
   * check their region and rank
   * 
   * if the region match
   * if the rank match
   * 
   * create private vc
   * move both player to private vc
   * 
   * remove their names from queue embed
   * 
*/

module.exports = async (interaction) => {
  async function newPrivateDuoVc(player1Obj) {
    let member1 = guild.members.cache.get(player1Id);
    let member2 = guild.members.cache.get(player2Id);

    let queueNotificationChannel = guild.channels.cache.find(
      (c) => c.name === "queue-notification"
    );

    let duoRankRole = guild.roles.cache.find(
      (role) => role.name === "duo rank"
    );

    queueNotificationChannel.send(`${member1} and ${member2}, you got a duo ${duoRankRole}`);
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

    //remove their names from duoRankList
    let listOfId = [player1Id, player2Id];
    let newDuoRankList = duoRankList.filter(id => !listOfId.includes(id));

    dataObj.duoRankList = newDuoRankList;
    writeToFile(dataObj, "data.json");

    updateQueueEmbed(interaction);
  }

  //=============================Start=========================

  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let duoRankList = dataObj.duoRankList;
  let playerList = dataObj.playerList;

  let player1Id, player2Id;

  if (duoRankList.length >= 2) {

    outerLoop:
    for (player1Id of duoRankList) {
      for (player2Id of duoRankList) {

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
              "I": 1, "B": 1,
              "S": 2, "G": 3,
              "P": 4, "D": 5,
              "A": 6, "Im": 7,
              "R": 8
            }

            let player1Rank = player1Obj.rank;
            let player2Rank = player2Obj.rank;

            console.log("player1Rank: " + player1Rank);
            console.log("player2Rank: " + player2Rank);

            let player1RankGroup = player1Rank.slice(0, -1);
            let player1RankValue = rankValue[player1RankGroup];

            let player2RankGroup = player2Rank.slice(0, -1);
            let player2RankValue = rankValue[player2RankGroup];

            /**
             * Iron, Bronze, Silver and Gold can all rank group diff to find a match
             * 
             * if plat/plat 1 you can play with any gold but only up to diamond 1
             * 
             * if diamond or above, 1 group up or down and to the exact rank number
             * 
             */

            //if players are gold or below
            if (player1RankValue <= 3) {
              let rankValueDiff = Math.abs(player1RankValue - player2RankValue);
              
              if (rankValueDiff <= 1) {
                console.log("LOG: \t" + "Gold or below");
                //start new private vc
                newPrivateDuoVc(player1Obj);
                break outerLoop;
              }

              //if player is plat, they can play with gold or diamond that is the same rank
            } else if (player1RankValue === 4) {
              console.log("LOG: \t" + "Plat");
              let player1RankNum = parseInt(player1Rank.slice(-1));
              let player2RankNum = parseInt(player2Rank.slice(-1));

              //is gold or plat
              let goldOrPlat = (player2Rank === 3) || (player2RankValue === player1RankValue);
              //is exactly diamond
              let diamondMatch = (player2RankValue === 5) && (player2RankNum <= player1RankNum);

              if (goldOrPlat || diamondMatch) {
                //theres a match
                newPrivateDuoVc(player1Obj);
                break outerLoop;
              }

              //if players are diamond or above
            } else if (player1RankValue >= 5) {
              console.log("LOG: \t" + "Diamond or above");
              //if they are exactly rank above or below
              let player1RankNum = parseInt(player1Rank.slice(-1));
              let player2RankNum = parseInt(player2Rank.slice(-1));
              let rankRangeMatches = (Math.abs(player1RankValue - player2RankValue)) && (player1RankNum <= player2RankNum);

              if (rankRangeMatches) {
                newPrivateDuoVc(player1Obj);
                break outerLoop;
              }
            }
            //else no match
          }
        }
      }
    }
  }
};