const fs = require("node:fs");
const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const writeToFile = require("../../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "newPrivateTrioVc.js");

    if (!interaction.isButton()) return;
    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let vcInvite = dataObj.vcInvite;
    let buttonClicked = interaction.customId;

    let invited = false;
    let queuesId = "1102167519583817728";

    //vcType get from vcInvite the type of vc duo, trio etc...
    let vcType, memberPos;

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
    if (!(invited && vcType === "trio")) return;

    for (let i = 0; i < vcInvite.length; i++) {
      let invite = vcInvite[i];

      if (invite.interactionId === interaction.message.id) {
        //if interactionId is the same as interaction.message.id

        if (invite.vcType === "trio") {
          //check vcType in vcInvite if it is trio

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

              const player1Obj = playerList.find(obj => obj.id === member1.id);
              const player1RiotAccount = player1Obj.riotAccountList.find((obj) => obj.active === true);

              const player2Obj = playerList.find(obj => obj.id === member2.id);
              const player2RiotAccount = player2Obj.riotAccountList.find((obj) => obj.active === true);

              const player3Obj = playerList.find(obj => obj.id === member3.id);
              const player3RiotAccount = player3Obj.riotAccountList.find((obj) => obj.active === true);

              let textChannelName = member1.user.username + "'s trio lobby";
              let vcName = member1.user.username + "'s trio vc";

              let privateTrioTextChannel = await guild.channels.create({
                name: textChannelName,
                type: 0,
                parent: queuesId,
                permissionOverwrites: [
                  {
                    id: guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: member1,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: member2,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: member3,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                  }
                ]
              });

              //make private vc
              let privateTrioVc = await guild.channels.create({
                name: vcName,
                type: 2,
                userLimit: invite.inviteList.length,
                parent: queuesId,
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

              member1.voice.setChannel(privateTrioVc);
              member2.voice.setChannel(privateTrioVc);
              member3.voice.setChannel(privateTrioVc);

              //delete message and button in queue-notification
              let interactionId = dataObj.interactionId;
              interaction.message.delete(interactionId);

              //delete invite from vcInvite
              dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
              writeToFile(dataObj, "data.json");

              //lobby info object
              let trioVcObj = {
                type: "private trio",
                textChannelId: privateTrioTextChannel.id,
                voiceChannelId: privateTrioVc.id,
                playersList: [player1Obj, player2Obj, player3Obj]
              }

              //add private vc to cusotmVoiceChannel
              let customLobby = dataObj.customLobby;
              customLobby.push(trioVcObj);
              writeToFile(dataObj, "data.json");

              let infoEmbed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setAuthor({ name: "Q bot" })
                .setTitle("Player Info")
                .addFields(
                  { name: "Member", value: player1Obj.tag, inline: true },
                  { name: "Riot Id", value: player1RiotAccount.riotId, inline: true },
                  { name: "\u200B", value: "\u200B" },
                  { name: "Member", value: player2Obj.tag, inline: true },
                  { name: "Riot Id", value: player2RiotAccount.riotId, inline: true },
                  { name: "\u200B", value: "\u200B" },
                  { name: "Member", value: player3Obj.tag, inline: true },
                  { name: "Riot Id", value: player3RiotAccount.riotId, inline: true },
                  { name: "\u200B", value: "\u200B" },
                )
                .setTimestamp()

              privateTrioTextChannel.send({ embeds: [infoEmbed] });
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
  });
};
