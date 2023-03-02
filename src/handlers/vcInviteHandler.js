const fs = require("node:fs");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild, member } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let member1 = member;
    //let member2 = interaction.options.getMember("duo");

    if (interaction.isButton()) {
      //if duo clicked accept
      if (interaction.customId === "accept") {
        //make private vc
        let categoryId = "1074976911312289862";
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
        interaction.reply({
          content: `${member1.user.username} and ${member2.user.username} moved to ${member1.user.username + "'s duo vc"}`,
          ephemeral: true,
        });
        console.log("LOG: " + `${member1.user.username + "'s duo vc"} created`);

        let dataFile = fs.readFileSync("data.json");
        let dataObj = JSON.parse(dataFile);
        let customVoiceChannel = dataObj.customVoiceChannel;

        customVoiceChannel.push(member1.user.username + "'s duo vc");
        writeToFile(dataObj, "data.json");

      } else if (interaction.customId === "decline") {
        //dont make private vc and
      }
      //delete embed and buttons
    }
  });
};
