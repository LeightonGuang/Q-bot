const Discord = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require('../../utils/writeToFile');

/** check for match
   * 
   * trio rank
   * if there are more than 3 people
   * check their region and rank
   * 
   * if the region match
   * if the rank match
   * 
   * create private vc
   * move all 3 players to private vc
   * 
   * remove their names from queue embed
   * 
*/

module.exports = async (interaction) => {
  async function newPrivateTrioVc(player1Info) {
    let member1 = guild.members.cache.get(player1Id);
    let member2 = guild.members.cache.get(player2Id);
    let member3 = guild.members.cache.get(player3Id);

    let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

    let trioRankRole = guild.roles.cache.find(
      (role) => role.name === "trio rank"
    );

    queueNotificationChannel.send(`${member1}, ${member2} and ${member3}, you got a trio ${trioRankRole}`);
    console.log("Theres a match for trio rank");

    let categoryId = "1074976911312289862";
    let vcName = player1Info.tag + "'s queue";

    let createPrivateVc = await guild.channels.create({
      name: vcName,
      type: 2,
      userLimit: 3,
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
      ]
    });

    let customLobby = dataObj.customLobby;
    customLobby.push(vcName);
    writeToFile(dataObj, "data.json");

    //move the 3 players to their vc
    member1.voice.setChannel(createPrivateVc);
    member2.voice.setChannel(createPrivateVc);
    member3.voice.setChannel(createPrivateVc);

    //remove their names from trioRankList
    let listOfId = [player1Id, player2Id, player3Id];
    let newTrioRankList = trioRankList.filter(id => !listOfId.includes(id));

    dataObj.trioRankList = newTrioRankList;
    writeToFile(dataObj, "data.json");

    updateQueueEmbed(interaction);
  }

  //=============================Start=========================

  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let trioRankList = dataObj.trioRankList;
  let playerList = dataObj.playerList;

  let player1Id, player2Id, player3Id;

  if (trioRankList.length >= 3) {

    for (player1Id of trioRankList) {
      for (player2Id of trioRankList) {

        //it its is not checking the same player
        if (player1Id !== player2Id) {
          for (player3Id of trioRankList) {

            //it its is not checking the same player
            if (player3Id !== player2Id && player3Id !== player1Id) {

              const player1Info = playerList.find(obj => obj.id === player1Id);
              const player2Info = playerList.find(obj => obj.id === player2Id);
              const player3Info = playerList.find(obj => obj.id === player3Id);

              //check if all players are from the same region
              if ((player1Info.region === player3Info.region) && (player3Info.region === player3Obj.region)) {
                let rankValue = {
                  "I": 1, "B": 1,
                  "S": 2, "G": 3,
                  "P": 4, "D": 5,
                  "A": 6, "Im": 7,
                  "R": 8
                }

                let player1Rank = player1Info.rank;
                let player2Rank = player2Info.rank;
                let player3Rank = player3Info.rank;

                //get the rank group and rank number
                let player1RankGroup = player1Rank.slice(0, -1);
                let player1RankValue = rankValue[player1RankGroup];

                let player2RankGroup = player2Rank.slice(0, -1);
                let player2RankValue = rankValue[player2RankGroup];

                let player3RankGroup = player3Rank.slice(0, -1);
                let player3RankValue = rankValue[player3RankGroup];

                //if player1, player2 and player3 is gold or below
                if (player1Rank <= 3 && player2Rank <= 3 && player3Rank <= 3) {
                  let withinRank = (
                    Math.abs(player1RankValue - player2RankValue) &&
                    Math.abs(player1RankValue - player3RankValue) &&
                    Math.abs(player2RankValue - player3RankValue)
                  )

                  //if players are within rank range
                  if (withinRank) {
                    console.log("LOG: \t" + "Gold or below");
                    newPrivateTrioVc(player1Info);

                  }

                  //
                } else if (player1Rank === 4) {

                }
              }
            }
          }
        }
      }
    }
  }
};