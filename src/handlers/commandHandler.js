const fs = require("node:fs");

/**
 * if command used is /help or /player-profile
 *  it will run anywhere 
 */

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "commandHandler.js");

    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let userId = interaction.user.id;

    //list of commands that can be used in general chat
    let playerCommands = ["help", "account", "poll", "credit"];

    //list of commands that only mods can use
    let modCommands = ["mod-help", "mod"];

    //check if member is in playerList already
    let playerExist = playerList.find(obj => obj.id === userId);

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

    let commandChannelId = "1095144647023661166";

    //if interaction commands are help and player-profile
    if (playerCommands.some(item => item === interaction.commandName)) {
      console.log("LOG: \t" + "running /" + interaction.commandName);
      await command.execute(interaction);

    } else if (modCommands.some(item => item === interaction.commandName)) {
      //if commands are mod commands 
      if (isMod) {
        //if member is a mod
        if (interaction.commandName === "mod") {
          //if its /mod run
          console.log("LOG: \t" + "running /" + interaction.commandName);
          await command.execute(interaction);

        } else if (interaction.commandName === "mod-help") {
          //if its /mod-help then it had to be in 
          if (interaction.channel.name === "⌨｜command") {
            //check if the command is used in command channel
            console.log("LOG: \t" + "running /" + interaction.commandName);
            await command.execute(interaction);

          } else {
            //if its not in command channel
            let modCommandChannel = guild.channels.cache.find((channel) => channel.name === "⌨｜command");
            interaction.reply({
              content: `Please use ${interaction} in ${modCommandChannel}`,
              ephemeral: true
            });
            console.log("/" + interaction.commandName + " is not in ⌨｜command");
          }
        }

      } else {
        //if member interacted is not a mod
        await interaction.reply({
          content: "you are not a mod",
          ephemeral: true
        });
        console.log("LOG: \t" + "member who is not a mod is trying to use mod command");
      }

      //if command is /queue
    } else if (interaction.commandName === "queue") {
      //if /queue is in queue channel
      let queueId = "1090741922185887754";
      if (interaction.channel.id === queueId) {
        console.log("LOG: \t" + "running /" + interaction.commandName);
        await command.execute(interaction);

      } else {
        interaction.reply({
          content: "You can't run this command here",
          ephemeral: true
        });
        console.log("LOG: \t" + "can't run this command here");
      }

      //if command is in command channel
    } else if (interaction.channel.id === commandChannelId) {
      //
      if (playerExist) {
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
