const fs = require("node:fs");
const Discord = require("discord.js");
const writeToFile = require("../../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "newPrivateQuadVc.js");
    
    if (!interaction.isButton()) return;
    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let vcInvite = dataObj.vcInvite;
    let buttonClicked = interaction.customId;

    let invited = false;
    let categoryId = "1074976911312289862";
    let vcType, memberPos;
    let sameInteraction;

    //check if the member interacted is invited
    for (let invite of vcInvite) {
      //if member interacted with their own invite

      if (invite.inviteList[0] === interaction.user.id) {
        try {
          await interaction.reply({ content: "You can't accept or decline your own invite", ephemeral: true });
          console.log("LOG: \t" + "member interacted with their own invite");
          return;

        } catch (error) {
          return;
        }
      }

      //check if member interacted is invited
      for (let i = 1; i < invite.inviteList.length; i++) {
        let member = invite.inviteList[i];
        //console.log(`${interaction.user.id} vs ${member}`)
        if (interaction.user.id === member) {
          console.log("member is invited");
          vcType = invite.vcType;
          //console.log(vcType);
          memberPos = i;
          invited = true;
          break;
        }
      }
    }

    //if member is in the inviteList
    if (invited && vcType === "quad") {
      console.log("running quad code");

      //go through each invite in vcInvite
      for (let i = 0; i < vcInvite.length; i++) {
        let invite = vcInvite[i];

        //finding the right accept and decline message
        if (invite.interactionId === interaction.message.id) {
          sameInteraction = true;
        }
        //check the vcType in that object

        //if the vcType is "quad" then run then keep going
        console.log(`${sameInteraction} and ${buttonClicked}`);
        if (sameInteraction && buttonClicked === "accept") {

          console.log("member accepted the invite");
          await interaction.reply({ content: "You have accepted the invite", ephemeral: true });


          //change member's decision to true
          dataObj.vcInvite[i].decision[memberPos] = true;
          writeToFile(dataObj, "data.json");

          //if all the member accepted their invite
          if (dataObj.vcInvite[i].decision.every(Boolean)) {

            //create new private vc
            let member1 = invite.inviteList[0];
            let member2 = invite.inviteList[1];
            let member3 = invite.inviteList[2];
            let member4 = invite.inviteList[3];
            let member5 = invite.inviteList[4];
            member1 = guild.members.cache.get(member1);
            member2 = guild.members.cache.get(member2);
            member3 = guild.members.cache.get(member3);
            member4 = guild.members.cache.get(member4);
            member5 = guild.members.cache.get(member5);

            //make private vc
            console.log("create quad private vc");
            let createQuadVc = await guild.channels.create({
              name: member1.user.username + "'s quad vc",
              type: 2,
              userLimit: invite.inviteList.length,
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
                {
                  id: member4,
                  allow: [Discord.PermissionsBitField.Flags.Connect],
                },
                {
                  id: member5,
                  allow: [Discord.PermissionsBitField.Flags.Connect],
                },
              ],
            });

            let newQuadObj = guild.channels.cache.find((channel) => channel.name === member1.user.username + "'s quad vc");
            member1.voice.setChannel(newQuadObj);
            member2.voice.setChannel(newQuadObj);
            member3.voice.setChannel(newQuadObj);
            member4.voice.setChannel(newQuadObj);
            member5.voice.setChannel(newQuadObj);

            //delete message and button in queue-notification
            let interactionId = dataObj.interactionId;
            interaction.message.delete(interactionId);

            //delete invite from vcInvite
            dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
            writeToFile(dataObj, "data.json");

            //add private vc name in cusotmVoiceChannel
            let customLobby = dataObj.customLobby;
            customLobby.push(member1.user.username + "'s quad vc");
            writeToFile(dataObj, "data.json");
          }

        } else if (buttonClicked === "decline") {
          await interaction.reply({ content: `You declined the invite`, ephemeral: true });
          console.log("member declined the invite");
          //delete the invite from vcInvite
          dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
          writeToFile(dataObj, "data.json");

          //delete message and button in queue-notification
          let interactionId = dataObj.interactionId;
          interaction.message.delete(interactionId);
        }
        //else do nothing
      }

    }
  });
};
