const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const writeToFile = require("../../utils/writeToFile");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "newPrivateDuoVc.js");
    //if interaction is not a button then return
    if (!interaction.isButton()) return;
    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let vcInvite = dataObj.vcInvite;
    let buttonClicked = interaction.customId;

    let invited = false;
    let queuesId = "1102167519583817728";
    let vcType;

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
          invited = true;
          break;
        }
      }
    }
    //if its a duo private vc
    if (vcType !== "duo") return;

    //member is in the inviteList and 
    if (!invited) return;

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

              const player1Obj = playerList.find(obj => obj.id === member1.id);
              const player1RiotAccount = player1Obj.riotAccountList.find((obj) => obj.active === true);

              const player2Obj = playerList.find(obj => obj.id === member2.id);
              const player2RiotAccount = player2Obj.riotAccountList.find((obj) => obj.active === true);

              let textChannelName = member1.user.username + "'s duo lobby";
              let vcName = member1.user.username + "'s duo vc";

              //make private text channel
              let privateDuoTextChannel = await guild.channels.create({
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
                  }
                ]
              });

              //make private vc
              let privateDuoVc = await guild.channels.create({
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
                ],
              });

              //move both members to the new vc
              member1.voice.setChannel(privateDuoVc);
              member2.voice.setChannel(privateDuoVc);

              //delete invite from vcInvite
              dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
              writeToFile(dataObj, "data.json");

              //lobby info object
              let duoVcObj = {
                type: "private duo",
                textChannelId: privateDuoTextChannel.id,
                voiceChannelId: privateDuoVc.id,
                playersList: [player1Obj, player2Obj]
              }

              //add private vc name in cusotmVoiceChannel
              let customLobby = dataObj.customLobby;
              customLobby.push(duoVcObj);
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
                )
                .setTimestamp()

              privateDuoTextChannel.send({ embeds: [infoEmbed] });
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
