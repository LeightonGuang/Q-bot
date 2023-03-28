const { EmbedBuilder, Embed } = require('discord.js');
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

    //function to remove all queue roles from 
    function removeAllRoles() {
      let rolesToRemove = [
        "duo rank",
        "trio queue",
        "5 stack",
        "1v1",
        "10 mans",
        "unrated",
      ];
      rolesToRemove.forEach((roleName) => {
        let role = guild.roles.cache.find((role) => role.name === roleName);
        interaction.member.roles.remove(role);
      });
      console.log("LOG: \t" + "remove all queue roles from player");
    }

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let duoList = dataObj.duoList;
    let trioList = dataObj.trioList;
    let fiveStackList = dataObj.fiveStackList;
    let oneVoneList = dataObj.oneVoneList;
    let tenMansList = dataObj.tenMansList;
    let playerQueueingInfo;
    let playerId = member.id;
    let playerInQueue;

    //=========================interaction is button======================
    if (interaction.isButton()) {
      buttonPressed = interaction.customId;
      memberWhoPressed = interaction.user;
      console.log(
        "LOG: \t" + `${memberWhoPressed.tag} clicked on (${buttonPressed})`
      );

      //
      let hasRole = member.roles.cache.some(
        (role) =>
          role.name === "duo rank" ||
          role.name === "trio queue" ||
          role.name === "5 stack" ||
          role.name === "1v1" ||
          role.name === "10 mans" ||
          role.name == "unrated"
      );

      let queueNotificationChannel = guild.channels.cache.find(
        (c) => c.name === "queue-notification"
      );

      //================start===================

      //if member is in queue remove any member with queuerole
      if (hasRole) {
        removeAllRoles();
      }

      /**
       * when duo ranked button is clicked
       * add duo rank role to member
       * add member discord id to duoList
       * edit the embed for duo rank queue
       * add member's discord name to duo rank queue
       */

      if (buttonPressed === "duoRankQueue") {
        //loop through duoList to see if member is in duo
        for (let i = 0; i < duoList.length; i++) {
          //check if player is in duoList
          playerInQueue = (playerId === duoList[i]);
        }

        if (!playerInQueue) {
          //add role to member
          let duoQueueRole = guild.roles.cache.find(
            (role) => role.name === "duo rank"
          );
          member.roles.add(duoQueueRole);

          //add playerQueueingInfo(player's discord id) to duoList
          duoList.push(interaction.user.id);
          writeToFile(dataObj, "data.json");

          await interaction.reply({
            content: "You are in duo rank queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You are in duo rank queue");

          queueNotificationChannel.send(`${memberWhoPressed} is queueing for ${duoQueueRole}`);
          console.log("LOG: \t" + `${memberWhoPressed} is queueing for ${duoQueueRole}`);

          //embed message object id
          let message = await interaction.channel.messages.fetch(dataObj.queueEmbedId);
          console.log("message: " + message);

          let newField = message.embeds[0].fields[0];
          console.log("newField: " + newField.value);

          //if duoList is empty
          if (duoList === []) {
            console.log("LOG: \t" + "duoList is empty");

            //if duoList is not empty add member nickname to a list 
          } else {
            let nameList = [];

            for (let playerId of duoList) {
              let name = await guild.members.fetch(playerId);
              nameList.push(name.nickname);
            }

            //change the field value of the embed
            newField.value = nameList.join(", ");
            console.log("LOG: \t" + "update the field of embed");
          }

          let newEmbed = EmbedBuilder.from(message.embeds[0]).addFields(newField);

          message.edit({ embeds: [newEmbed] });

          //if player is already in queue
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "member is already in queue");
        }

      } else if (buttonPressed === "trioRankQueue") {
        //add role to member
        let trioQueueRole = guild.roles.cache.find(
          (role) => role.name === "trio queue"
        );
        member.roles.add(trioQueueRole);
        await interaction.reply(`${memberWhoPressed} is queueing for trio (${trioQueueRole})`);

      } else if (buttonPressed === "fiveStackRankQueue") {
        //add role to member
        let fiveStackRole = guild.roles.cache.find(
          (role) => role.name === "5 stack"
        );
        member.roles.add(fiveStackRole);
        await interaction.reply(
          `
    ${memberWhoPressed} is queueing for 5 stack
    (${fiveStackRole})
    `
        );
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
        let memberHasRoles, memberInList;

        let rolesToRemove = [
          "duo rank",
          "trio queue",
          "5 stack",
          "1v1",
          "10 mans",
          "unrated",
        ];

        let queueList = [
          duoList,
          trioList,
          fiveStackList,
          oneVoneList,
          tenMansList
        ]

        //if player have queue roles
        member.roles.cache.forEach((role) => {
          if (rolesToRemove.includes(role.name)) {
            memberHasRoles = true;
          }
        });

        //if player is in lists
        for (let list of queueList) {
          if (list.includes(playerId)) {
            memberInList = true;
            console.log("LOG: \t" + "member is in list");
            break;
          }
        }

        if (memberHasRoles || memberInList) {
          let role = guild.roles.cache.find((role) => role.name === "duo rank");

          //remove player id from duoList
          dataObj.duoList = duoList.filter((item) => item !== playerId);
          console.log("LOG: \t" + "remove memberid from duoList");
          writeToFile(dataObj, "data.json");


          removeAllRoles();
          await interaction.reply({
            content: "You have been removed from queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You have been removed from queue");
          queueNotificationChannel.send(`${memberWhoPressed} has dequeued`);
          console.log("LOG: \t" + `${memberWhoPressed} has dequeued`);

        } else {
          await interaction.reply({
            content: "you are not in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You have been removed from queue");
        }
      }
    }
  });
};
