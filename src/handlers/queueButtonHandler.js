const { EmbedBuilder } = require('discord.js');
const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");
const duoQueueVcHandler = require("./queueVcHandler/duoQueueVcHandler");

/**
 * when any queue button is used
 * 
 * add the member the the corresponding queue
 * update the embed
 * check if any member matched
 * region
 * rank
 * if they match start a game
 * 
 * when dequeue is pressed
 * check if member is in any queue
 * if member is in queue (check queue by check if they have role)
 * remove them from their role and their id in the list
 * 
 * if not in queue then reply member not in queue
 */

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild, member } = interaction;

    //===========================functions============================

    //function to remove all queue roles from 
    function removeAllRoles() {
      allQueueRoles.forEach((roleName) => {
        let role = guild.roles.cache.find((role) => role.name === roleName);
        interaction.member.roles.remove(role);
      });
      console.log("LOG: \t" + "remove all queue roles from player");
    }

    async function updateQueueEmbed() {
      let message = await interaction.channel.messages.fetch(dataObj.queueEmbedId);

      //embed message object id
      //console.log("message: " + message);
      //console.log("message.embeds[0]: " + message.embeds[0]);


      let queueEmbed = message.embeds[0];
      //console.log("queueEmbed: " + queueEmbed.fields);

      //loop through the list of all the queue list
      for (let i = 0; i < allQueueList.length; i++) {
        let list = allQueueList[i];
        let nameList = [];

        //console.log("list: " + list);

        //if queue list is empty
        if (list.length === 0) {
          nameList = "--empty--";

          //if queue list is not empty
        } else {

          //loops through all the id in all the queue list
          for (let queuePlayerId of list) {
            //console.log("list: " + JSON.stringify(list));
            //console.log("list: " + list);
            let memberObj = await guild.members.fetch(queuePlayerId);


            //if member don't have nicname then add their username
            if (memberObj.nickname === null) {
              nameList.push(memberObj.user.username);

              //add the nickname of member to nameList
            } else {
              nameList.push(memberObj.nickname);
            }

            //console.log("member's name: " + memberObj.nickname);
            //console.log("nameList: " + nameList);
          }
        }

        //change the value of the fields
        if (nameList === "--empty--") {
          queueEmbed.fields[i].value = nameList;

          //if nameList have a list of people's name
        } else {
          queueEmbed.fields[i].value = nameList.join(", ");
        }
      }

      //console.log("new queueEmbed fields: " + JSON.stringify(queueEmbed.fields));

      let newEmbed = new EmbedBuilder()
        .setAuthor(message.embeds[0].author)
        .setTitle(message.embeds[0].title)
        .setDescription(message.embeds[0].description)
        .addFields(queueEmbed.fields)
        .setTimestamp()
        .setColor(0xFF0000);

      console.log("LOG: \t" + "update the field of embed");
      message.edit({ embeds: [newEmbed] });
    }

    function removeRoleAndId() {
      let hasRole = member.roles.cache.some(
        (role) =>
          role.name === "duo rank" ||
          role.name === "trio rank" ||
          role.name === "5 stack rank" ||
          role.name === "1v1" ||
          role.name === "10 mans" ||
          role.name == "unrated"
      );

      //if member is in queue remove any member with queuerole
      if (hasRole) {
        removeAllRoles();
      }

      //remove member from list
      for (let list of allQueueList) {
        //if player is in lists
        if (list.includes(playerId)) {
          let index = list.indexOf(playerId);
          list.splice(index, 1);

          console.log("LOG: \t" + "remove memberid from list");
          writeToFile(dataObj, "data.json");
        }
      }
    }

    //===========================variables=========================

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let duoRankList = dataObj.duoRankList;
    let trioRankList = dataObj.trioRankList;
    let fiveStackRankList = dataObj.fiveStackRankList;
    let oneVoneList = dataObj.oneVoneList;
    let tenMansList = dataObj.tenMansList;
    let unratedList = dataObj.unratedList;
    let playerList = dataObj.playerList;
    let playerId = member.id;
    let playerInQueue;

    //allQueueList and allQueueRoles should have the same order of the list and roles
    let allQueueList = [
      duoRankList,
      trioRankList,
      fiveStackRankList,
      oneVoneList,
      tenMansList,
      unratedList
    ];

    let allQueueRoles = [
      "duo rank",
      "trio rank",
      "5 stack rank",
      "1v1",
      "10 mans",
      "unrated",
    ];

    //=========================interaction is button======================
    if (interaction.isButton()) {
      let buttonPressed = interaction.customId;
      let memberWhoPressed = interaction.user;
      console.log(
        "LOG: \t" + `${memberWhoPressed.tag} clicked on (${buttonPressed})`
      );

      let queueNotificationChannel = guild.channels.cache.find(
        (c) => c.name === "queue-notification"
      );

      //================start===================

      /**
       * when duo ranked button is clicked
       * add duo rank role to member
       * add member discord id to duoRankList
       * edit the embed for duo rank queue
       * add member's discord name to duo rank queue
       */

      if (buttonPressed === "duoRankQueue") {
        //loop through duoRankList to see if member is in duo
        for (let i = 0; i < duoRankList.length; i++) {
          //check if player is in duoRankList
          playerInQueue = (playerId === duoRankList[i]);
        }

        //if player is not in queue
        if (!playerInQueue) {
          removeRoleAndId();

          //give player a duo rank role
          let duoRankRole = guild.roles.cache.find(
            (role) => role.name === "duo rank"
          );
          member.roles.add(duoRankRole);

          //add playerQueueingInfo(player's discord id) to duoRankList
          duoRankList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();

          // await interaction.reply({
          //   content: "You are in duo rank queue",
          //   ephemeral: true,
          // });

          console.log("LOG: \t" + "You are in duo rank queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${duoRankRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${duoRankRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "trioRankQueue") {
        //loop through trioRankList to see if member is in trio
        for (let i = 0; i < trioRankList.length; i++) {
          //check if player is in trioRankList
          playerInQueue = (playerId === trioRankList[i]);
        }

        removeRoleAndId();
        //if player is not in queue
        if (!playerInQueue) {
          //give player a trio rank role
          let trioRankRole = guild.roles.cache.find(
            (role) => role.name === "trio rank"
          );
          member.roles.add(trioRankRole);

          //add playerQueueingInfo(player's discord id) to trioRankList
          trioRankList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You are in trio rank queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You are in trio rank queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${trioRankRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${trioRankRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "fiveStackRankQueue") {
        //loop through fiveStackRankList to see if member is in 5 stack
        for (let i = 0; i < fiveStackRankList.length; i++) {
          //check if player is in fiveStackRankList
          playerInQueue = (playerId === fiveStackRankList[i]);
        }

        removeRoleAndId();
        //if player is not in queue
        if (!playerInQueue) {
          //give player a 5 stack rank role
          let fiveStackRankRole = guild.roles.cache.find(
            (role) => role.name === "5 stack rank"
          );
          member.roles.add(fiveStackRankRole);

          //add playerQueueingInfo(player's discord id) to fiveStackRankList
          fiveStackRankList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You are in 5 stack rank queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You are in 5 stack rank queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${fiveStackRankRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${fiveStackRankRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }
      } else if (buttonPressed === "oneVoneQueue") {
        //loop through oneVoneList to see if member is in 1v1
        for (let i = 0; i < oneVoneList.length; i++) {
          //check if player is in oneVoneList
          playerInQueue = (playerId === oneVoneList[i]);
        }
        removeRoleAndId();

        //if player is not in queue
        if (!playerInQueue) {
          //give player a 1v1 role
          let oneVoneRole = guild.roles.cache.find(
            (role) => role.name === "1v1"
          );
          member.roles.add(oneVoneRole);

          //add playerQueueingInfo(player's discord id) to oneVoneList
          oneVoneList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You are in 1v1 queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You are in 1v1 rank queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${oneVoneRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${oneVoneRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "tenMansQueue") {
        //loop through tenMansList to see if member is in 1v1
        for (let i = 0; i < tenMansList.length; i++) {
          //check if player is in tenMansList
          playerInQueue = (playerId === tenMansList[i]);
        }
        removeRoleAndId();

        //if player is not in queue
        if (!playerInQueue) {
          //give player a 5 stack rank role
          let tenMansRole = guild.roles.cache.find(
            (role) => role.name === "10 mans"
          );
          member.roles.add(tenMansRole);

          //add playerQueueingInfo(player's discord id) to tenMansList
          tenMansList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You are in 5 stack rank queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You are in 10 mans queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${tenMansRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${tenMansRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "unrated") {
        //loop through unratedList to see if member is in 1v1
        for (let i = 0; i < unratedList.length; i++) {
          //check if player is in unratedList
          playerInQueue = (playerId === unratedList[i]);
        }
        removeRoleAndId();

        //if player is not in queue
        if (!playerInQueue) {
          //give player a 5 stack rank role
          let unratedRole = guild.roles.cache.find(
            (role) => role.name === "unrated"
          );
          member.roles.add(unratedRole);

          //add playerQueueingInfo(player's discord id) to unratedList
          unratedList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You are in unrated rank queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You are in unrated queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${unratedRole}`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} is queueing for ${unratedRole.name}`);

          //embed message object id
          updateQueueEmbed();

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "dequeue") {

        //check if member has a queue role
        let memberHasRoles, memberInList, listToDequeue;

        //if player have queue roles
        member.roles.cache.forEach((role) => {
          if (allQueueRoles.includes(role.name)) {
            memberHasRoles = true;
          }
        });

        for (let list of allQueueList) {
          //if player is in one of the queue list
          if (list.includes(playerId)) {
            listToDequeue = list;

            memberInList = true;
            console.log("LOG: \t" + "member is in list");
            break;
          }
        }

        if (memberHasRoles || memberInList) {
          let role = guild.roles.cache.find((role) => role.name === "duo rank");

          //remove player id from listToDequeue
          //console.log("listToDequeue before filtering: " + typeof listToDequeue);

          //remove member id from list
          //console.log("index of playerid: " + listToDequeue);
          let index = listToDequeue.indexOf(playerId);
          listToDequeue.splice(index, 1);
          //console.log(listToDequeue);

          console.log("LOG: \t" + "remove memberid from listToDequeue");
          writeToFile(dataObj, "data.json");

          //console.log("dequeued listToDequeue: " + listToDequeue);

          removeAllRoles();
          updateQueueEmbed();

          await interaction.deferUpdate();
          // await interaction.reply({
          //   content: "You have been removed from queue",
          //   ephemeral: true,
          // });
          console.log("LOG: \t" + "You have been removed from queue");
          queueNotificationChannel.send(`${memberWhoPressed} has dequeued`);
          console.log("LOG: \t" + `${memberWhoPressed.tag} has dequeued`);

        } else {
          await interaction.reply({
            content: "you are not in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You are not in queue");
        }
      } else if (buttonPressed === "refresh") {
        //refresh the queue embed
        updateQueueEmbed();
        await interaction.deferUpdate();
        console.log("LOG: \t" + "refreshed the embed");
      }

      /** check for match
       * 
       * duo rank
       * if there are more than 2 people
       * check their region and rank
       * 
       * 
       */

      if (buttonPressed === "duoRankQueue") {
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
                    console.log("Theres a match");
                    duoQueueVcHandler(interaction, [player1Obj, player2Obj]);
                    break outerLoop;

                  } else {
                    //rank diff too high
                    //do nothing
                  }
                }
              }
            }
          }
        }
      }
    }
  });
};
