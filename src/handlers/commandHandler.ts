import axios from "axios";

export const data = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "commandHandler.js");

    const { commandName, guildId }: { commandName: string; guildId: string } =
      interaction;

    const userDiscordId: string = interaction.user.id;

    //list of commands that can be used in general chat
    const generalChatCommandList: string[] = [
      "help",
      "valorant",
      "vct",
      "cs2-event",
      "poll",
      "coin-flip",
      "vro-font",
      "ping",
      "credit",
    ];

    const commandChannelCommandList: string[] = [
      "account",
      "gamble",
      "private-vc",
    ];

    //list of commands that only mods can use
    const modCommandList: string[] = ["mod-help", "mod"];
    let userRegistered: boolean;

    //check if member is in playerList already
    try {
      userRegistered = await axios.get(
        "http://localhost:8080/api/account/isRegistered/" + userDiscordId
      );
    } catch (error) {
      console.error(error);
    }

    //=========================interaction is a command===========================
    if (!interaction.isChatInputCommand()) return;
    const command: any = interaction.client.commands.get(commandName);

    if (!command) {
      return console.log(`No ${commandName} found`);
    }

    const qBotServerId = "1065216119641755668";

    if (guildId === qBotServerId) {
      //if guild is Qs
      const mod: any = interaction.guild.roles.cache.find(
        (role) => role.name === "mod"
      );

      const isMod: boolean = interaction.member.roles.cache.has(mod.id);

      const qGeneralChannelId: string = "1078356156159889528";
      const qCommandChannelId: string = "1095144647023661166";
      const qModCommandChannelId: string = "1075104362176729128";
      const qCommandTestChannelId: string = "1221632361700130866";

      if (interaction.channel.id === qCommandTestChannelId) {
        await command.execute(interaction);
      } else if (modCommandList.includes(commandName)) {
        // if commands are mod commands
        if (isMod) {
          await command.execute(interaction);
        } else if (!isMod) {
          await interaction.reply({
            content: `You do not have permission to use this command`,
            ephemeral: true,
          });
        }
      } else if (interaction.channel.id === qGeneralChannelId) {
        //if commands are in general chat
        if (generalChatCommandList.includes(commandName)) {
          // if commands are usable in general chat
          await command.execute(interaction);
        } else if (commandChannelCommandList.includes(commandName)) {
          // if commands are not usable in command channel
          await interaction.reply({
            content: `Please use" ***${interaction}*** in <#${qCommandChannelId}>`,
            ephemeral: true,
          });
        }
      } else if (interaction.channel.id === qCommandChannelId) {
        // if commands are in command channel
        if (
          commandChannelCommandList.includes(commandName) ||
          generalChatCommandList.includes(commandName)
        ) {
          // every command is usable in command channel
          await command.execute(interaction);
        } else if (
          !generalChatCommandList.includes(commandName) &&
          !commandChannelCommandList.includes(commandName)
        ) {
          // if commands are not usable in command channel or general chat
          await interaction.reply({
            content: `Error, unknown command: ${commandName}`,
            ephemeral: true,
          });
        }
      }
    } else if (guildId === "1061462082140262400") {
      //if gulid is shruge
      await command.execute(interaction);
    }
  });
};
