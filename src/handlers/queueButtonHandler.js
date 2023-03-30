const { EmbedBuilder } = require('discord.js');
const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");

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
    let playerId = member.id;
    let playerInQueue;

    //allQueueList and allQueueRoles should have the same order of the list and roles
    let allQueueList = [
      duoRankList,
      trioRankList,
      fiveStackRankList,
      oneVoneList,
      tenMansList
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
      buttonPressed = interaction.customId;
      memberWhoPressed = interaction.user;
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

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for duo ${duoRankRole}`);
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

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for trio ${trioRankRole}`);
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

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for trio ${fiveStackRankRole}`);
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
        //add role to member
        let oneVoneRole = guild.roles.cache.find((role) => role.name === "1v1");
        member.roles.add(oneVoneRole);
        await interaction.reply(`${memberWhoPressed} is queueing for 1v1 (${oneVoneRole})`);
      } else if (buttonPressed === "tenMansQueue") {
        //add role to member
        let tenMansRole = guild.roles.cache.find(
          (role) => role.name === "10 mans"
        );

        member.roles.add(tenMansRole);
        await interaction.reply(`${memberWhoPressed} is queueing for 10 mans (${tenMansRole})`);

      } else if (buttonPressed === "unrated") {
        //add role to member
        let unratedRole = guild.roles.cache.find(
          (role) => role.name === "unrated"
        );
        member.roles.add(unratedRole);
        await interaction.reply(`${memberWhoPressed} is queueing for unrated (${unratedRole})`);

        /**
         * when dequeue button is clicked
         * 
         * if member is has a queue role and in queue list
         *    remove any queue roles from member
         *    remove member's discord id from any list that they're in
         * 
         * if member don't have queue role and is not in queue list
         *    tell them they're not in queue
         */

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
      }
    }
  });
};
