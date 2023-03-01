const fs = require("node:fs");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    const { guild } = interaction;

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);
    let playerList = dataObj.playerList;

    let profileDone = false;

    let userInteracted = interaction.user.id;

    //loop through the playerList to check if player profile is done
    for (let i = 0; i < playerList.length; i++) {
      //if user interacted alrady set up player profile
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

    //if command is in queue channel
    if (interaction.channel.name === "queue") {
      //if commands are in queue channel then run the command
      if (profileDone) {
        try {
          await command.execute(interaction);
          console.log("interaction: /" + interaction.commandName);
        } catch (error) {
          console.log(error);
          await interaction.reply({
            content: "Error executing command",
            ephemeral: true,
          });
        }
        //if player profile is not done (use /player-profile)
      } else {
        await interaction.reply({
          content:
            "Please use /player-profile to setup your info before queueing",
          ephemeral: true,
        });
        console.log(
          "Please use /player-profile to setup your info before queueing"
        );
      }

      //if command is not in queue channel
    } else {
      //but use help and player profile command run it
      if (
        interaction.commandName === "help" ||
        interaction.commandName === "player-profile"
      ) {
        try {
          await command.execute(interaction);
          console.log("interaction: /" + interaction.commandName);
        } catch (error) {
          console.log(error);
          await interaction.reply({
            content: "Error executing command",
            ephemeral: true,
          });
        }

        //if not in queue and using commands that are not permitted
      } else {
        let channelTag = guild.channels.cache.find(
          (channel) => channel.name === "queue"
        );
        await interaction.reply({
          content: `Please use / commands in ${channelTag}`,
          ephemeral: true,
        });
        console.log(
          "LOG: \t" + `Please use / commands in ${channelTag.name} channel`
        );
      }
    }
  });
};
