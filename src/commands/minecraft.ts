import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";

export const data: any = {
  data: new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Commands for minecraft")
    .addSubcommand((subcommand) =>
      subcommand.setName("server-on").setDescription("turn on the server")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server-status").setDescription("get server status")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("players-online")
        .setDescription("check who is online in the server")
    ),

  async execute(interaction) {
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "server-on": {
        const serverOn = await import("../sub-commands/minecraft/server-on.js");
        serverOn.subCommand(interaction);
        break;
      }
      case "server-status": {
        const serverStatus = await import(
          "../sub-commands/minecraft/server-status.js"
        );
        serverStatus.subCommand(interaction);
        break;
      }
      case "players-online": {
        const playerOnline = await import(
          "../sub-commands/minecraft/players-online.js"
        );
        playerOnline.subCommand(interaction);
        break;
      }
    }
  },
};
