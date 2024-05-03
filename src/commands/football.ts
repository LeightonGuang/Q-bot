import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";

export const data = {
  data: new SlashCommandBuilder()
    .setName("football")
    .setDescription("sends a random football image")
    .addSubcommand((addSubCommand) =>
      addSubCommand
        .setName("league-fixtures")
        .setDescription("get upcoming fixtures from a legue")
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
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "league-fixtures": {
        const leagueFixtures = await import(
          "../sub-commands/football/league-fixtures.js"
        );
        leagueFixtures.subCommnand(interaction);
        break;
      }
    }
  },
};
