const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");
const updateQueueEmbed = require("../utils/updateQueueEmbed");
const newPrivateDuoVc = require("./privateVc/newPrivateDuoVc");

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

    let memberLeavingQWR;

    memberLeavingQWR = oldState.channelId;
    memberLeavingQWR = (memberLeavingQWR === queueWaitingRoomId);

    let today = new Date();
    let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;

    //member joining, leaving and moving vc log
    if (!oldState.channelId && newState.channelId) {
      //if member joins a vc
      console.log(dateTime + " LOG: \t" + `${newState.member.user.tag} has joined [${newState.channel.name}]`);

    } else if (oldState.channelId && !newState.channelId) {
      //if member left a vc
      console.log(dateTime + " LOG: \t" + `${oldState.member.user.tag} has left [${oldState.channel.name}]`);

    } else if (oldState.channelId !== newState.channelId) {
      //if a member moved from a vc to another vc
      console.log(dateTime + " LOG: \t" + `${oldState.member.user.tag} has moved from [${oldState.channel.name}] to [${newState.channel.name}]`);
    }

    //member muting and defening log
    if (oldState.selfMute === false && newState.selfMute === true) {
      //if member muted themselves
      console.log(dateTime + " LOG: \t" + `${newState.member.user.tag} has muted`);

    } else if (oldState.selfMute === true && newState.selfMute === false) {
      //if member unmuted themselves
      console.log(dateTime + " LOG: \t" + `${newState.member.user.tag} has unmuted`);

    } else if (oldState.selfDeaf === false && newState.selfDeaf === true) {
      //if member deafened themselves
      console.log(dateTime + " LOG: \t" + `${newState.member.user.tag} has deafened`);

    } else if (oldState.selfDeaf === true && newState.selfDeaf === false) {
      //if member undeafened themselves
      console.log(dateTime + " LOG: \t" + `${newState.member.user.tag} has undeafened`);
    }

    //QWR queue waiting room
    if (memberLeavingQWR) {
      console.log(dateTime + " LOG: \t" + oldState.member.user.tag + " has disconnected from queue waiting room");
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
