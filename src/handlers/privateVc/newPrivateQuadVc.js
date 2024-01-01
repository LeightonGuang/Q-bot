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
    let playerList = dataObj.playerList;

    let vcInvite = dataObj.vcInvite;
    let buttonClicked = interaction.customId;

    let invited = false;
    let queuesId = "1102167519583817728";
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
        if (interaction.user.id === member) {
          console.log("member is invited");
          vcType = invite.vcType;
          memberPos = i;
          invited = true;
          break;
        }
      }
    }

    //if member is in the inviteList
    if (invited && vcType === "quad") {

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

            member1 = guild.members.cache.get(member1);
            member2 = guild.members.cache.get(member2);
            member3 = guild.members.cache.get(member3);
            member4 = guild.members.cache.get(member4);

            const player1Obj = playerList.find(obj => obj.id === member1.id);
            const player2Obj = playerList.find(obj => obj.id === member2.id);
            const player3Obj = playerList.find(obj => obj.id === member3.id);
            const player4Obj = playerList.find(obj => obj.id === member4.id);

            let textChannelName = member1.user.username + "'s quad lobby";
            let vcName = member1.user.username + "'s quad vc";

            //make private text channel
            let privateQuadTextChannel = await guild.channels.create({
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
                },
                {
                  id: member4,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                }
              ]
            });

            //make private vc
            let privateQuadVc = await guild.channels.create({
              name: member1.user.username + "'s quad vc",
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
                {
                  id: member4,
                  allow: [Discord.PermissionsBitField.Flags.Connect],
                },
              ],
            });

            member1.voice.setChannel(privateQuadVc);
            member2.voice.setChannel(privateQuadVc);
            member3.voice.setChannel(privateQuadVc);
            member4.voice.setChannel(privateQuadVc);

            //delete message and button in queue-notification
            let interactionId = dataObj.interactionId;
            interaction.message.delete(interactionId);

            //delete invite from vcInvite
            dataObj.vcInvite = vcInvite.filter((item) => item !== invite);
            writeToFile(dataObj, "data.json");

            let quadVcObj = {
              type: "private quad",
              textChannelId: privateQuadTextChannel.id,
              voiceChannelId: privateQuadVc.id,
              playersList: []
            }

            //add private vc name in cusotmVoiceChannel
            let customLobby = dataObj.customLobby;
            customLobby.push(quadVcObj);
            writeToFile(dataObj, "data.json");

            let infoEmbed = new EmbedBuilder()
              .setColor(0xFFFFFF)
              .setAuthor({ name: "Q bot" })
              .setTitle("Player Info")
              .addFields(
                { name: "Member", value: player1Obj.tag, inline: true },
                { name: "Riot Id", value: player1Obj.riotId, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Member", value: player2Obj.tag, inline: true },
                { name: "Riot Id", value: player2Obj.riotId, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Member", value: player3Obj.tag, inline: true },
                { name: "Riot Id", value: player3Obj.riotId, inline: true },
                { name: "\u200B", value: "\u200B" },
                { name: "Member", value: player4Obj.tag, inline: true },
                { name: "Riot Id", value: player4Obj.riotId, inline: true },
                { name: "\u200B", value: "\u200B" },
              )
              .setTimestamp()

            privateQuadTextChannel.send({ embeds: [infoEmbed] });
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
