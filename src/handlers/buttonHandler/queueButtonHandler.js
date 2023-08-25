const fs = require("node:fs");
const writeToFile = require("../../utils/writeToFile");
const updateQueueEmbed = require("../../utils/updateQueueEmbed");

/**
 * check if member are in queue waiting room
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

module.exports = async (interaction) => {
  console.log("FILE: \t" + "queueButtonHandler.js");
  const { guild, member } = interaction;
  const splittedArray = interaction.customId.split('-');
  let memberClicked = interaction.user;
  //console.log("memberClicked: " + memberClicked);

  if (splittedArray[0] !== "queue") return;

  //===========================functions============================

  //function to remove all queue roles from 
  function removeAllRoles() {
    allQueueRoles.forEach((roleName) => {
      let role = guild.roles.cache.find((role) => role.name === roleName);
      interaction.member.roles.remove(role);
    });
    console.log("LOG: \t" + "remove all queue roles from player");
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
  let playerId = member.id;
  let playerInQueue;
  let queueNotificationChannel = guild.channels.cache.get("1082124963793866843");
  let queueWaitingRoomId = guild.channels.cache.get("1095136188622454916");

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

  //================start===================

  /**
   * when duo ranked button is clicked
   * add duo rank role to member
   * add member discord id to duoRankList
   * edit the embed for duo rank queue
   * add member's discord name to duo rank queue
   */

  let memberInQueueWaitingRoom = queueWaitingRoomId.members.has(memberClicked.id);

  switch (splittedArray[1]) {
    case "duoRankQueue": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);


        const duoQueueVcHandler = require("../queueMatchHandler/duoRankQueueMatchHandler");
        duoQueueVcHandler(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }
      break;

    case "trioRankQueue": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }
      break;

    case "fiveStackRankQueue": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);

        const fiveStackRankQueueHandler = require("../queueMatchHandler/fiveStackRankQueueHandler");
        fiveStackRankQueueHandler(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }

      break;

    case "oneVoneQueue": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);

        const oneVoneQueueHandler = require("../queueMatchHandler/oneVoneQueueHandler");
        oneVoneQueueHandler(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }
      break;

    case "tenMansQueue": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);

        const tenMansQueueHandler = require("../queueMatchHandler/tenMansQueueMatchHandler");
        tenMansQueueHandler(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }
      break;

    case "unrated": {
      //check if members are in queue waiting room
      if (!memberInQueueWaitingRoom) {
        console.log("LOG: \t" + "member is not in queue waiting room");
        return await interaction.reply({ content: `${memberClicked} Please join ${queueWaitingRoomId} to queue for games.`, ephemeral: true });
      }

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
        updateQueueEmbed(interaction);

        //if player is already in queue
      } else {
        await interaction.reply({
          content: "You are already in queue",
          ephemeral: true,
        });
        console.log("LOG: \t" + "member is already in queue");
      }
    }
      break;

    case "dequeue": {
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
        try {
          let index = listToDequeue.indexOf(playerId);
          listToDequeue.splice(index, 1);

        } catch (error) {
          console.log("LOG: \t" + "player is not in queue");
        }

        console.log("LOG: \t" + "remove memberid from listToDequeue");
        writeToFile(dataObj, "data.json");

        //console.log("dequeued listToDequeue: " + listToDequeue);

        removeAllRoles();
        updateQueueEmbed(interaction);

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
      break;

    case "refresh": {
      //refresh the queue embed
      updateQueueEmbed(interaction);
      await interaction.deferUpdate();
      console.log("LOG: \t" + "refreshed the embed");
    }
      break;
  }
};
