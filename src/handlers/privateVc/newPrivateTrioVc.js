const fs = require("node:fs");
const Discord = require("discord.js");
const writeToFile = require("../../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      const { guild } = interaction;

      let dataFile = fs.readFileSync("data.json");
      let dataObj = JSON.parse(dataFile);

      let vcInvite = dataObj.vcInvite;
      let buttonClicked = interaction.customId;

      let invited = false;
      let categoryId = "1074976911312289862";
      let vcType, memberPos;

      //check if the member interacted is invited
      for (let invite of vcInvite) {
        //if member interacted with their own invite
        if (invite.inviteList[0] === interaction.user.id) {
          try {
            await interaction.reply({ content: "You can't accept or decline your own invite", ephemeral: true });
            console.log("LOG: \t" + "member interacted with their own invite");
          } catch (error) {
            return;
          }

        }
        for (let i = 1; i < invite.inviteList.length; i++) {
          let member = invite.inviteList[i];
          if (interaction.user.id === member) {
            vcType = invite.vcType;
            memberPos = i;
            invited = true;
            break;
          }
        }
      }
      //if member is in the inviteList
      if (invited && vcType === "trio") {
        console.log("running trio code");
        for (let i = 0; i < vcInvite.length; i++) {
          let invite = vcInvite[i];
          //if interactionId is the same as interaction.message.id
          if (invite.interactionId === interaction.message.id) {

            //check the vcType in that object
            if (invite.vcType === "trio") {
              //if the vcType is "trio" then run then keep going
              if (buttonClicked === "accept") {
                await interaction.reply({ content: "You have accepted the invite", ephemeral: true });

                //add 1 to decision
                dataObj.vcInvite[i].decision[memberPos] = true;
                writeToFile(dataObj, "data.json");

                //if all the member accepted their invite
                if (dataObj.vcInvite[i].decision.every(Boolean)) {

                  //create new private vc
                  let member1 = invite.inviteList[0];
                  let member2 = invite.inviteList[1];
                  let member3 = invite.inviteList[2];
                  member1 = guild.members.cache.get(member1);
                  member2 = guild.members.cache.get(member2);
                  member3 = guild.members.cache.get(member3);

                  //make private vc
                  let createTrioVc = await guild.channels.create({
                    name: member1.user.username + "'s trio vc",
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
                    ],
                  });

                  let newTrioObj = guild.channels.cache.find((channel) => channel.name === member1.user.username + "'s trio vc");
                  member1.voice.setChannel(newTrioObj);
                  member2.voice.setChannel(newTrioObj);
                  member3.voice.setChannel(newTrioObj);

                  //delete message and button in queue-notification
                  let interactionId = dataObj.interactionId;
                  interaction.message.delete(interactionId);

                  //delete invite from vcInvite
                  dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
                  writeToFile(dataObj, "data.json");

                  //add private vc name in cusotmVoiceChannel
                  let customLobby = dataObj.customLobby;
                  customLobby.push(member1.user.username + "'s trio vc");
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
              break;
            }
            //else do nothing
          }
        }

      }
    }
  });
};
