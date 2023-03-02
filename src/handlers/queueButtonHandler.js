const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
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

    //=====================================================
    const { guild, member } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let duoList = dataObj.duoList;
    let trioList = dataObj.trioList;
    let fiveStackList = dataObj.fiveStackList;
    let oneVoneList = dataObj.oneVoneList;
    let tenMansList = dataObj.tenMansList;
    let playerQueueingInfo;
    let playerId = member.id;
    let player_is_in_queue;

    //=========================interaction is button======================
    if (interaction.isButton()) {
      buttonPressed = interaction.customId;
      memberWhoPressed = interaction.user;
      console.log(
        "LOG: \t" + `${memberWhoPressed.tag} clicked on (${buttonPressed})`
      );

      let isInQueue = member.roles.cache.some(
        (role) =>
          role.name === "duo rank" ||
          role.name === "trio queue" ||
          role.name === "5 stack" ||
          role.name === "1v1" ||
          role.name === "10 mans" ||
          role.name == "unrated"
      );
      //if member is in queue remove any member with queuerole
      if (isInQueue) {
        removeAllRoles();
      }

      //update the embed

      let queueNotificationChannel = guild.channels.cache.find(
        (c) => c.name === "queue-notification"
      );

      if (buttonPressed === "duoRankQueue") {
        for (let i = 0; i < duoList.length; i++) {
          //check if player is in duoList
          player_is_in_queue = playerId === duoList[i];
        }

        if (!player_is_in_queue) {
          //add role to member
          let duoQueueRole = guild.roles.cache.find(
            (role) => role.name === "duo rank"
          );
          member.roles.add(duoQueueRole);

          //add playerQueueingInfo(player's discord id) to duoList
          duoList.push(interaction.user.id);

          await interaction.reply({
            content: "You are in duo rank queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You are in duo rank queue");

          writeToFile(dataObj, "data.json");

          queueNotificationChannel.send(
            `${memberWhoPressed} is queueing for ${duoQueueRole}`
          );
          console.log(
            "LOG: \t" + `${memberWhoPressed} is queueing for ${duoQueueRole}`
          );
          //if player
        } else {
          await interaction.reply({
            content: "You are already in queue",
            ephemeral: true,
          });
          console.log();
        }
      } else if (buttonPressed === "trioRankQueue") {
        //add role to member
        let trioQueueRole = guild.roles.cache.find(
          (role) => role.name === "trio queue"
        );
        member.roles.add(trioQueueRole);
        await interaction.reply(
          `
    ${memberWhoPressed} is queueing for trio
    (${trioQueueRole})
    `
        );
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
        await interaction.reply(
          `
    ${memberWhoPressed} is queueing for 1v1
    (${oneVoneRole})
    `
        );
      } else if (buttonPressed === "tenMansQueue") {
        //add role to member
        let tenMansRole = guild.roles.cache.find(
          (role) => role.name === "10 mans"
        );
        member.roles.add(tenMansRole);
        await interaction.reply(
          `
    ${memberWhoPressed} is queueing for 10 mans
    (${tenMansRole})
    `
        );
      } else if (buttonPressed === "unrated") {
        //add role to member
        let unratedRole = guild.roles.cache.find(
          (role) => role.name === "unrated"
        );
        member.roles.add(unratedRole);
        await interaction.reply(
          ` 
    ${memberWhoPressed} is queueing for unrated
    (${unratedRole})
        `
        );
      } else if (buttonPressed === "dequeue") {
        let rolesToRemove = [
          "duo rank",
          "trio queue",
          "5 stack",
          "1v1",
          "10 mans",
          "unrated",
        ];
        let memberIsInQueue = false;
        member.roles.cache.forEach((role) => {
          //if player have queue roles
          if (rolesToRemove.includes(role.name)) {
            memberIsInQueue = true;
          }
        });

        if (memberIsInQueue) {
          let role = guild.roles.cache.find((role) => role.name === "duo rank");
          //if member have duo rank roles and if player id is in duoList
          if (member.roles.cache.has(role.id)) {
            //remove player id from duoList
            dataObj.duoList = duoList.filter((item) => item !== playerId);
            writeToFile(dataObj, "data.json");
          }

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
            content: "you're not in queue",
            ephemeral: true,
          });
          console.log("LOG: \t" + "You have been removed from queue");
        }
      }
    }
  });
};
