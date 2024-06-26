import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export const data = {
  data: new SlashCommandBuilder()
    .setName("football")
    .setDescription("sends a random football image")
    .addSubcommand((addSubCommand) =>
      addSubCommand
        .setName("fixtures")
        .setDescription("get upcoming fixtures from a league")
        .addStringOption((option) =>
          option
            .setName("league")
            .setDescription("Select a league")
            .setRequired(true)
            .setChoices(
              { name: "Champions League", value: "CL" },
              { name: "Primeira Liga", value: "PPL" },
              { name: "Premier League", value: "PL" },
              { name: "Eredivisie", value: "DED" },
              { name: "Bundesliga", value: "BL1" },
              { name: "Ligue 1", value: "FL1" },
              { name: "Serie A", value: "SA" },
              { name: "La Liga", value: "PD" },
              { name: "EFL Championship", value: "ELC" },
              { name: "Campeonato Brasileiro Série A", value: "BSA" },
              { name: "Euro 2024", value: "EC" }
            )
        )
    )
    .addSubcommand((addSubCommand) =>
      addSubCommand
        .setName("results")
        .setDescription("get fixtures results from a league")
        .addStringOption((option) =>
          option
            .setName("league")
            .setDescription("Select a league")
            .setRequired(true)
            .setChoices(
              { name: "Champions League", value: "CL" },
              { name: "Primeira Liga", value: "PPL" },
              { name: "Premier League", value: "PL" },
              { name: "Eredivisie", value: "DED" },
              { name: "Bundesliga", value: "BL1" },
              { name: "Ligue 1", value: "FL1" },
              { name: "Serie A", value: "SA" },
              { name: "La Liga", value: "PD" },
              { name: "EFL Championship", value: "ELC" },
              { name: "Campeonato Brasileiro Série A", value: "BSA" },
              { name: "Euro 2024", value: "EC" }
            )
        )
    )
    .addSubcommand((addSubCommand) =>
      addSubCommand
        .setName("tables")
        .setDescription("get fixtures results from a league")
        .addStringOption((option) =>
          option
            .setName("league")
            .setDescription("Select a league")
            .setRequired(true)
            .setChoices(
              { name: "Champions League", value: "CL" },
              { name: "Primeira Liga", value: "PPL" },
              { name: "Premier League", value: "PL" },
              { name: "Eredivisie", value: "DED" },
              { name: "Bundesliga", value: "BL1" },
              { name: "Ligue 1", value: "FL1" },
              { name: "Serie A", value: "SA" },
              { name: "La Liga", value: "PD" },
              { name: "EFL Championship", value: "ELC" },
              { name: "Campeonato Brasileiro Série A", value: "BSA" },
              { name: "Euro 2024", value: "EC" }
            )
        )
    ),

  async execute(interaction) {
    const FOOTBALLDATA_API_KEY = process.env.FOOTBALLDATA_API_KEY;
    const footballDataApiUrl = "https://api.football-data.org/v4";
    const headers = {
      "X-Auth-Token": FOOTBALLDATA_API_KEY,
    };

    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "fixtures": {
        const fixtures: any = await import(
          "../sub-commands/football/fixtures.js"
        );
        fixtures.subCommnand(interaction, footballDataApiUrl, headers);
        break;
      }

      case "results": {
        const results: any = await import("../sub-commands/football/result.js");
        results.subCommand(interaction, footballDataApiUrl, headers);
        break;
      }

      case "tables": {
        const tables: any = await import("../sub-commands/football/tables.js");
        tables.subCommand(interaction, footballDataApiUrl, headers);
        break;
      }
    }
  },
};
