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

    //if interaction is a command that doesn't have to be in queue channel
    if (playerCommands.some(item => item === interaction.commandName)) {
      await command.execute(interaction);
      console.log("interaction: /" + interaction.commandName);

      //if interaction is a command that is a mod command
    } else if (modCommands.some(item => item === interaction.commandName)) {

      //mod command can only be used in command channel
      if (interaction.channel.name === "⌨｜command") {
        await command.execute(interaction);
        console.log("interaction: /" + interaction.commandName);

        //can't run mod command that is not used in command channel
      } else {
        await interaction.reply({ content: "command only for mods", ephemeral: true });
        console.log(`normie trying to use the command: ${interaction.commandName}`);
      }

      //for the rest of the command that is not exclude and not mod command
    } else if (!playerCommands.some(item => item === interaction.commandName)) {

      //if player profile is done
      if (profileDone) {

        //if command is used in the queue channel
        if (interaction.channel.name === "queue") {
          await command.execute(interaction);
          console.log("interaction: /" + interaction.commandName);

          //command is not used in queue channel
        } else {
          let channelTag = guild.channels.cache.find((channel) => channel.name === "queue");
          await interaction.reply({
            content: `Please use / commands in ${channelTag}`,
            ephemeral: true,
          });
          console.log("LOG: \t" + `Please use / commands in ${channelTag.name} channel`);
        }

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
