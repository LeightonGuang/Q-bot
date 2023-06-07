const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");
const updateQueueEmbed = require("../utils/updateQueueEmbed");

/**
 * vcStateHandler.js dequeue member when they disconnect from queue waiting room
 * 
 * check if someone disconnected from a vc
 * 
 */

module.exports = (client) => {
  let myInteraction;

  client.on("interactionCreate", (interaction) => {
    myInteraction = interaction;
  });

  client.on("voiceStateUpdate", async (oldState, newState) => {
    console.log("FILE: \t" + "vcStateHandler.js");

    const { guild } = newState;
    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let allQueueList = [
      "duoRankList", "trioRankList", "fiveStackRankList",
      "oneVoneList", "tenMansList", "unratedList"];

    queueWaitingRoomId = "1095136188622454916";

    if (oldState.channel.id === queueWaitingRoomId) {
      console.log("LOG: \t" + oldState.member.user.tag + " has disconnected from queue waiting room");
      //if someone left the queue waiting room vc

      for (let queueList of allQueueList) {
        let queueListName = queueList;
        queueList = dataObj[queueList];
        //check if that member is in any of these queue list

        for (let memberId of queueList) {
          let memberFound = (oldState.member.id === memberId);

          if (memberFound) {
            //if member is in one of the lists
            let newList = queueList.filter((i) => i !== oldState.member.id);

            for (let prop in dataObj) {
              //loop through all the properties in dataObj
              if (prop === queueListName) {
                //if they are the same name
                dataObj[prop] = newList;
                writeToFile(dataObj, "data.json");

                updateQueueEmbed(myInteraction);

                let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");

                queueNotificationChannel.send(`${oldState.member.user} has dequeued`);
                console.log(`${oldState.member.user.tag} left ${oldState.channel.name} and has dequeued`);
                return;
              }
            }
          }
        }
      }
    }
  });
};
