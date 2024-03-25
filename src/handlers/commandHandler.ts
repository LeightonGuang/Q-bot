import axios from "axios";

export const data = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "commandHandler.js");

    const { guild }: { guild: any } = interaction;

    const discordId: string = interaction.user.id;
    const guildId: string = interaction.guildId;

    //list of commands that can be used in general chat
    const generalCommands: string[] = ["help", "account", "poll", "credit"];
    //list of commands that only mods can use
    const modCommands: string[] = ["mod-help", "mod"];
    let userRegistered: boolean;

    //check if member is in playerList already
    try {
      userRegistered = await axios.get(
        "http://localhost:8080/api/account/registered/" + discordId
      );
    } catch (error) {
      console.error(error);
    }

    //=========================interaction is a command===========================
    if (!interaction.isChatInputCommand()) return;
    const command: any = interaction.client.commands.get(
      interaction.commandName
    );

    if (!command) {
      console.log(`No ${interaction.commandName} found`);
      return;
    }

    if (guildId === "1065216119641755668") {
      //if guild is Qs
      const mod: any = interaction.guild.roles.cache.find(
        (role) => role.name === "mod"
      );
      const isMod: boolean = interaction.member.roles.cache.has(mod.id);

      const commandChannelId: string = "1095144647023661166";

      //if interaction commands are help and player-profile
      if (generalCommands.some((item) => item === interaction.commandName)) {
        console.log("LOG: \t" + "running /" + interaction.commandName);
        await command.execute(interaction);
      } else if (modCommands.some((item) => item === interaction.commandName)) {
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
              const modCommandChannel: any = guild.channels.cache.find(
                (channel) => channel.name === "⌨｜command"
              );
              interaction.reply({
                content: `Please use ${interaction} in ${modCommandChannel}`,
                ephemeral: true,
              });
              console.log(
                "/" + interaction.commandName + " is not in ⌨｜command"
              );
            }
          }
        } else {
          //if member interacted is not a mod
          await interaction.reply({
            content: "you are not a mod",
            ephemeral: true,
          });
          console.log(
            "LOG: \t" + "member who is not a mod is trying to use mod command"
          );
        }

        //if command is /queue
      } else if (interaction.commandName === "queue") {
        //if /queue is in queue channel
        const queueId: string = "1090741922185887754";
        if (interaction.channel.id === queueId) {
          console.log("LOG: \t" + "running /" + interaction.commandName);
          await command.execute(interaction);
        } else {
          interaction.reply({
            content: "You can't run this command here",
            ephemeral: true,
          });
          console.log("LOG: \t" + "can't run this command here");
        }

        //if command is in command channel
      } else if (interaction.channel.id === commandChannelId) {
        //
        if (userRegistered) {
          console.log("LOG: \t" + "running /" + interaction.commandName);
          await command.execute(interaction);

          //if player profile is not done
        } else {
          await interaction.reply({
            content:
              "Please use /account add-riot-account to setup your info before queueing",
            ephemeral: true,
          });
          console.log(
            "LOG: \t" +
              "Please use /player-profile to setup your info before queueing"
          );
        }
      }
    } else if (guildId === "1061462082140262400") {
      //if gulid is shruge

      const disabledCommands = await command.execute(interaction);
    }
  });
};
