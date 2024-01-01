const Discord = require("discord.js");
const fs = require("node:fs");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");
const writeToFile = require("../../utils/writeToFile");

/** check for match
 *
 * 5 stack
 * if there are more than 5 people
 * check their region
 *
 * if the region match
 *
 * create private vc
 * move all players to private vc
 *
 * remove their names from queue embed
 *
 */

module.exports = async (interaction) => {
  //=============================Start=========================

  const { guild } = interaction;

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let fiveStackRankList = dataObj.fiveStackRankList;
  let playerList = dataObj.playerList;

  if (fiveStackRankList.length >= 5) {
    //let fiveStackPlayers = playerList.filter((playerObj)=> playerObj.region === )

    outerLoop: for (let player1Id of fiveStackRankList) {
      for (let player2Id of fiveStackRankList) {
        if (player1Id !== player2Id) {
          for (let player3Id of fiveStackRankList) {
            if (player3Id !== player1Id && player3Id !== player2Id) {
              for (let player4Id of fiveStackRankList) {
                if (
                  player4Id !== player1Id &&
                  player4Id !== player2Id &&
                  player4Id !== player3Id
                ) {
                  for (let player5Id of fiveStackRankList) {
                    if (
                      player5Id !== player1Id &&
                      player5Id !== player2Id &&
                      player5Id !== player3Id &&
                      player5Id !== player4Id
                    ) {
                      //get the object of all players
                      const player1Obj = playerList.find(
                        (obj) => obj.id === player1Id
                      );
                      const player2Obj = playerList.find(
                        (obj) => obj.id === player2Id
                      );
                      const player3Obj = playerList.find(
                        (obj) => obj.id === player3Id
                      );
                      const player4Obj = playerList.find(
                        (obj) => obj.id === player4Id
                      );
                      const player5Obj = playerList.find(
                        (obj) => obj.id === player5Id
                      );

                      //check if all players are from the same region
                      if (
                        player1Obj.region === player2Obj.region &&
                        player2Obj.region === player3Obj.region &&
                        player3Obj.region === player4Obj.region &&
                        player4Obj.region === player5Obj.region
                      ) {
                        //create private vc

                        let member1 = guild.members.cache.get(player1Id);
                        let member2 = guild.members.cache.get(player2Id);
                        let member3 = guild.members.cache.get(player3Id);
                        let member4 = guild.members.cache.get(player4Id);
                        let member5 = guild.members.cache.get(player5Id);

                        let queueNotificationChannel = guild.channels.cache.get(
                          "1082124963793866843"
                        );

                        let fiveStackRankRole = guild.roles.cache.find(
                          (role) => role.name === "5 stack rank"
                        );

                        queueNotificationChannel.send(
                          `${member1} and ${member2}, you got a 5 stack game ${fiveStackRankRole}`
                        );
                        console.log("Theres a match for 5 stack");

                        let queuesId = "1102167519583817728";
                        let textChannelName =
                          member1.user.username + "'s 5 stack rank lobby";
                        let vcName = player1Obj.tag + "'s 5 stack rank";

                        let privateTextChannel = await guild.channels.create({
                          name: textChannelName,
                          type: 0,
                          parent: queuesId,
                          permissionOverwrites: [
                            {
                              id: guild.id,
                              deny: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: member1,
                              allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: member2,
                              allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: member3,
                              allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: member4,
                              allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: member5,
                              allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                          ],
                        });

                        let privateVc = await guild.channels.create({
                          name: vcName,
                          type: 2,
                          userLimit: 5,
                          parent: queuesId,
                          permissionOverwrites: [
                            {
                              id: guild.id,
                              deny: [Discord.PermissionsBitField.Flags.Connect],
                            },
                            {
                              id: member1,
                              allow: [
                                Discord.PermissionsBitField.Flags.Connect,
                              ],
                            },
                            {
                              id: member2,
                              allow: [
                                Discord.PermissionsBitField.Flags.Connect,
                              ],
                            },
                            {
                              id: member3,
                              allow: [
                                Discord.PermissionsBitField.Flags.Connect,
                              ],
                            },
                            {
                              id: member4,
                              allow: [
                                Discord.PermissionsBitField.Flags.Connect,
                              ],
                            },
                            {
                              id: member5,
                              allow: [
                                Discord.PermissionsBitField.Flags.Connect,
                              ],
                            },
                          ],
                        });

                        let fiveStackRankObj = {
                          type: "5 stack",
                          textChannelId: privateTextChannel.id,
                          voiceChannelId: privateVc.id,
                          playerList: [
                            player1Obj,
                            player2Obj,
                            player3Obj,
                            player4Obj,
                            player5Obj,
                          ],
                        };

                        //add 5 stack rank vc to customVoiceChannel
                        let customLobby = dataObj.customLobby;
                        customLobby.push(fiveStackRankObj);
                        writeToFile(dataObj, "data.json");

                        //move all 5 players to the vc
                        member1.voice.setChannel(privateVc);
                        member2.voice.setChannel(privateVc);
                        member3.voice.setChannel(privateVc);
                        member4.voice.setChannel(privateVc);
                        member5.voice.setChannel(privateVc);

                        //remove their names from fiveStackRankList
                        let listOfId = [
                          player1Id,
                          player2Id,
                          player3Id,
                          player4Id,
                          player5Id,
                        ];
                        let fiveStackRankList = fiveStackRankList.filter(
                          (id) => !listOfId.includes(id)
                        );

                        dataObj.fiveStackRankList = newFiveStackRankList;
                        writeToFile(dataObj, "data.json");

                        updateQueueEmbed(interaction);

                        break outerLoop;
                      }
                      //not in the same region
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
