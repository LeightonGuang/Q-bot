const fs = require("node:fs");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let profileDone = false;
    let userInteracted = interaction.user.id;

    let playerCommands = ["help", "player-profile"];
    let modCommands = ["mod-help", "mod"];

    //check if member's player profile is setup done
    for (let i = 0; i < playerList.length; i++) {

      //if member alrady setup player profile
      if (userInteracted === playerList[i].id) {
        profileDone = true;
        break;
      }
    }

    //=========================interaction is a command===========================
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.log(`No ${interaction.commandName} found`);
      return;
    }

    //console.log("command: /" + interaction.commandName);
    let mod = interaction.guild.roles.cache.find(role => role.name === "mod");
    let isMod = interaction.member.roles.cache.has(mod.id);

    //if interaction commands are help and player-profile
    if (playerCommands.some(item => item === interaction.commandName)) {
      console.log("LOG: \t" + "running /" + interaction.commandName);
      await command.execute(interaction);

      //if commands are mod commands 
    } else if (modCommands.some(item => item === interaction.commandName)) {
      //if member is a mod
      if (isMod) {
        //if its /mod run
        if (interaction.commandName === "mod") {
          console.log("LOG: \t" + "running /" + interaction.commandName);
          await command.execute(interaction);

          //if its /mod-help then it had to be in 
        } else if (interaction.commandName === "mod-help") {
          //check if the command is used in command channel
          if (interaction.channel.name === "⌨｜command") {
            console.log("LOG: \t" + "running /" + interaction.commandName);
            await command.execute(interaction);

            //if its not in command channel
          } else {
            let modCommandChannel = guild.channels.cache.find((channel) => channel.name === "⌨｜command");
            interaction.reply({
              content: `Please use ${interaction} in ${modCommandChannel}`,
              ephemeral: true
            });
            console.log("/" + interaction.commandName + " is not in ⌨｜command");
          }
        }

        //if member interacted is not a mod
      } else {
        await interaction.reply({
          content: "you are not a mod",
          ephemeral: true
        });
        console.log("LOG: \t" + "member who is not a mod is trying to use mod command");
      }

      //if command is in queue channel
    } else if (interaction.channel.name === "queue") {
      //
      if (profileDone) {
        console.log("LOG: \t" + "running /" + interaction.commandName);
        await command.execute(interaction);


        //if player profile is not done
      } else {
        await interaction.reply({
          content: "Please use /player-profile to setup your info before queueing",
          ephemeral: true
        });
        console.log("LOG: \t" + "Please use /player-profile to setup your info before queueing");
      }
    }
  });
};
