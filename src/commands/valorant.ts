import { SlashCommandBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("valorant")
    .setDescription("Commands for Valorant related stuff")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check-rank")
        .setDescription("Shows your current rank and peak rank")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("win-percentage")
        .setDescription("Shows your current act rank win percentage")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("last-game-stats")
        .setDescription("Shows your last game stats")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("match-history")
        .setDescription("Shows your last 10 games results")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("map-win-percentage")
        .setDescription("Shows your maps win percentage")
        .addStringOption((option) =>
          option
            .setName("map")
            .setDescription("default is all maps")
            .setChoices(
              { name: "Bind", value: "bind" },
              { name: "Haven", value: "haven" },
              { name: "Split", value: "split" },
              { name: "Ascent", value: "ascent" },
              { name: "Breeze", value: "breeze" },
              { name: "Lotus", value: "lotus" },
              { name: "Sunset", value: "sunset" }
            )
        )
        .addUserOption((option) =>
          option.setName("player").setDescription("default is yourself")
        )
    ),

  async execute(interaction) {
    console.log("FILE:\t" + "valorant.js");

    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "check-rank": {
        const checkRank = await import(
          "../sub-commands/valorant/check-rank.js"
        );
        checkRank.subCommand(interaction);
        break;
      }
      case "win-percentage": {
        const winPercentage = await import(
          "../sub-commands/valorant/win-percentage.js"
        );
        winPercentage.subCommand(interaction);
        break;
      }
      case "last-game-stats": {
        const lastGameStats = await import(
          "../sub-commands/valorant/last-game-stats.js"
        );
        lastGameStats.subCommand(interaction);
        break;
      }
      case "match-history": {
        const matchHistory = await import(
          "../sub-commands/valorant/match-history.js"
        );
        matchHistory.subCommand(interaction);
        break;
      }
      case "map-win-percentage": {
        const mapWinPercentage = await import(
          "../sub-commands/valorant/map-win-percentage.js"
        );
        mapWinPercentage.subCommand(interaction);
        break;
      }
    }
  },
};
