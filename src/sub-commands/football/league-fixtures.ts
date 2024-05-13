import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommnand = async (interaction) => {
  const leagueValue: string = interaction.options.get("league").value;

  const FOOTBALLDATA_API_KEY = process.env.FOOTBALLDATA_API_KEY;
  const footballDataApiUrl = "https://api.football-data.org/v4";
  const headers = {
    "X-Auth-Token": FOOTBALLDATA_API_KEY,
  };

  const {
    data: { competition, matches },
  }: { data: any; competitions: any; matches: any } = await axios.get(
    footballDataApiUrl + "/competitions/" + leagueValue + "/matches",
    { headers }
  );

  const groupedMatchStages: any = {};

  matches.forEach((match) => {});

  const upcomingMatches: any[] = matches.filter((match: any) => {
    return (
      match.status === "TIMED" &&
      (match.homeTeam.name !== null || match.awayTeam.name !== null)
    );
  });

  console.log(upcomingMatches);

  let footballEmbedList: EmbedBuilder[] = [];
  const footballHeaderEmbed = new EmbedBuilder()
    .setTitle(competition.name)
    .setThumbnail(competition.emblem)
    .setColor(0xffffff);

  const footballMatchesEmbed = upcomingMatches.map((match) =>
    new EmbedBuilder()
      .setAuthor({
        name: match.homeTeam.name,
        iconURL: match.homeTeam.crest,
      })
      .setDescription(match.awayTeam.name)
      .setThumbnail(match.awayTeam.crest)
  );

  footballEmbedList = [footballHeaderEmbed, ...footballMatchesEmbed];

  try {
    await interaction.reply({ embeds: footballEmbedList });
  } catch (error) {
    console.error(error);
  }
};
