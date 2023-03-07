const fs = require("node:fs");
const Discord = require("discord.js");
const writeToFile = require("../utils/writeToFile");
const { type } = require("node:os");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild, member } = interaction;

    //if button is clicked
    if (interaction.isButton()) {

      let dataFile = fs.readFileSync("data.json");
      let dataObj = JSON.parse(dataFile);

      let vcInvite = dataObj.vcInvite;
      let inviteList = vcInvite[0].inviteList;
      console.log("vcInvite: " + inviteList[1]);

      let member1, member2, member3, member4, member5, inviteObj, invitePos, inviteType;
      let listContainMember = false;

      let categoryId = "1074976911312289862";

      let memberClicked = interaction.user.id;
      console.log("member clicked: " + memberClicked);

      //check if member clicked is in list
      for (let invite of vcInvite) {
        for (let m of invite.inviteList) {
          //if member is not the one who created the invite
          if (memberClicked !== invite.inviteList[0]) {
            //if member clicked is in the list
            if (memberClicked === m) {
              console.log("LOG: \t" + "member is in the list");
              listContainMember = true;
              inviteType = invite.vcType;
              inviteObj = invite;
              break;
            }
            //invite creator clicked on their own invite
          } else {
            interaction.reply({ content: "You can't accept or decline your own invite", ephemeral: true })
            console.log("LOG: \t" + "invite creator clicked on their own invite");
            return 1;
          }
        }

        //if member is in list make true
        if (listContainMember) {
          //if accept is clicked 
          if (interaction.customId === "accept") {
            switch (inviteType) {
              case "duo":
                member1 = inviteObj.inviteList[0];
                member2 = inviteObj.inviteList[1];
                member1 = guild.members.cache.get(member1);
                member2 = guild.members.cache.get(member2);

                //make private vc
                let newDuoVoiceChannel = await guild.channels.create({
                  name: member1.user.username + "'s duo vc",
                  type: 2,
                  userLimit: 2,
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

                //delete the invite from vcInvite
                dataObj.vcInvite = vcInvite.filter((item) => item !== inviteObj);
                writeToFile(dataObj, "data.json");

                //delete message and button in queue-notification
                let interactionId = dataObj.interactionId;
                interaction.message.delete(interactionId);

                console.log("LOG: " + `${member1.user.username + "'s duo vc"} created`);

                let customVoiceChannel = dataObj.customVoiceChannel;
                customVoiceChannel.push(member1.user.username + "'s duo vc");
                writeToFile(dataObj, "data.json");
                break;

              case "trio":
                //do something
                break;

              case "quad":
                //do something
                break;

              case "stack":
                //do something
                break;

              default:
                console.log("Error");
                break;
            }


          } else if (interaction.customId === "decline") {
            //dont make private vc and
            //delete the invite from vcInvite
            dataObj.vcInvite = vcInvite.filter((item) => item !== inviteObj);
            writeToFile(dataObj, "data.json");

            //delete message and button in queue-notification
            let interactionId = dataObj.interactionId;
            interaction.message.delete(interactionId);

            await interaction.reply({ content: `You declined the invite`, ephemeral: true });
          }

          //if member is not in inviteList end/
        } else {
          interaction.reply({ content: "You are not invited", ephemeral: true });
          console.log("LOG: \t" + `${interaction.username} clicked an is not invited`);
        }
      }
    }
  });
};
