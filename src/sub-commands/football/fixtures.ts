import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommnand = async (interaction, footballDataApiUrl, headers) => {
  const leagueValue: string = interaction.options.get("league").value;

  try {
    const {
      data: { competition, matches },
    }: { data: any; competitions: any; matches: any } = await axios.get(
      footballDataApiUrl + "/competitions/" + leagueValue + "/matches",
      { headers }
    );

    const footballHeaderEmbed = new EmbedBuilder()
      .setTitle(competition.name)
      .setThumbnail(competition.emblem)
      .setColor(0xffffff);

    let upcomingMatches: any[] = matches.filter((match: any) => {
      return (
        match.status === "TIMED" &&
        (match.homeTeam.name !== null || match.awayTeam.name !== null)
      );
    });

    upcomingMatches = upcomingMatches.slice(0, 5);

    const upcomingMatchesList: EmbedBuilder[] = [];

    upcomingMatches.forEach((match) => {
      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setAuthor({ name: match.group, iconURL: match.homeTeam.crest })
        .setTitle(`${match.homeTeam.name} vs ${match.awayTeam.name}`)
        .setDescription(
          `${match.score.fullTime.home} - ${match.score.fullTime.away}`
        );

      upcomingMatchesList.push(matchEmbed);
    });

    const liveMatches: any[] = matches.filter((match: any) => {
      return (
        match.status === "IN_PLAY" &&
        (match.homeTeam.name !== null || match.awayTeam.name !== null)
      );
    });

    const liveMatchesList: EmbedBuilder[] = [];

    liveMatches.forEach((match) => {
      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setAuthor({ name: match.group, iconURL: match.homeTeam.crest })
        .setTitle(`${match.homeTeam.name} vs ${match.awayTeam.name}`)
        .setDescription(
          `${match.score.fullTime.home} - ${match.score.fullTime.away}`
        );

      liveMatchesList.push(matchEmbed);
    });

    try {
      await interaction.reply({
        embeds: [
          footballHeaderEmbed,
          ...upcomingMatchesList,
          ...liveMatchesList,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
