import { SlashCommandBuilder } from "discord.js";
import axios from "axios";

export const data = {
  data: new SlashCommandBuilder()
    .setName("football")
    .setDescription("sends a random football image")
    .addSubcommand((addSubCommand) =>
      addSubCommand
        .setName("team")
        .setDescription("sends a random football image for a team")
    ),

  async execute(interaction) {
    const FOOTBALLDATA_API_KEY = process.env.FOOTBALLDATA_API_KEY;

    const footballDataApiUrl = "https://api.football-data.org/v4";

    const headers = {
      "X-Auth-Token": FOOTBALLDATA_API_KEY,
    };

    const {
      data: { competition, matches },
    }: { data: any; competitions: any; matches: any } = await axios.get(
      footballDataApiUrl + "/competitions/CL/matches",
      {
        headers,
      }
    );

    const lastTenMatches: any[] = matches.slice(-10);

    console.log(lastTenMatches);

    await interaction.reply({ content: "/football" });
  },
};
