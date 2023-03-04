const fs = require("node:fs");
const Discord = require("discord.js");
const writeToFile = require("../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild, member } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let vcInvite = dataObj.vcInvite;

    let member1, member2, member3, member4, member5, inviteObj;

    let categoryId = "1074976911312289862";

    if (interaction.isButton()) {
      //if duo clicked accept
      //check who clicked accept
      if (interaction.customId === "accept") {

        for (let invite of vcInvite) {
          switch (invite.type) {
            case "duo":
              inviteObj = invite;
              member1 = invite.inviteList[0];
              member2 = invite.inviteList[1];
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
      //delete embed and buttons
    }
  });
};
