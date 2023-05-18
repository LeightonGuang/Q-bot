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
      let vcType;

      //check if the member interacted is invited
      for (let invite of vcInvite) {
        //if member interacted with their own invite
        if (invite.inviteList[0] === interaction.user.id) {
          await interaction.reply({ content: "You can't accept or decline your own invite", ephemeral: true });
          console.log("LOG: \t" + "member interacted with their own invite");
          return 1;
        }
        for (let i = 1; i < invite.inviteList.length; i++) {
          let member = invite.inviteList[i];
          if (interaction.user.id === member) {
            vcType = invite.vcType;
            invited = true;
            break;
          }
        }
      }
      //if its a duo private vc
      if (vcType === "duo") {
        //member is in the inviteList and 
        if (invited) {
          console.log("running duo code");
          for (let i = 0; i < vcInvite.length; i++) {
            let invite = vcInvite[i];
            //if interactionId is the same as interaction.message.id
            if (invite.interactionId === interaction.message.id) {

              //check the vcType in that object
              if (invite.vcType === "duo") {
                //if the vcType is "duo" then run then keep going
                if (buttonClicked === "accept") {
                  await interaction.reply({ content: "You have accepted the invite", ephemeral: true });

                  //add 1 to decision
                  dataObj.vcInvite[i].decision = true;
                  writeToFile(dataObj, "data.json");

                  //if all the member accepted their invite
                  if (invite.decision) {
                    //delete message and button in queue-notification
                    let interactionId = dataObj.interactionId;
                    interaction.message.delete(interactionId);

                    //create new private vc
                    let member1 = invite.inviteList[0];
                    let member2 = invite.inviteList[1];
                    member1 = guild.members.cache.get(member1);
                    member2 = guild.members.cache.get(member2);

                    //make private vc
                    let createDuoVc = await guild.channels.create({
                      name: member1.user.username + "'s duo vc",
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
                      ],
                    });

                    let newDuoObj = guild.channels.cache.find((channel) => channel.name === member1.user.username + "'s duo vc");
                    member1.voice.setChannel(newDuoObj);
                    member2.voice.setChannel(newDuoObj);

                    //delete invite from vcInvite
                    dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
                    writeToFile(dataObj, "data.json");

                    //add private vc name in cusotmVoiceChannel
                    let customLobby = dataObj.customLobby;
                    customLobby.push(member1.user.username + "'s duo vc");
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
    }
  });
};
