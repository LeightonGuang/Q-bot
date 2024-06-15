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
      const utcDate: Date = new Date(match.utcDate);
      const unixTimestamp: Date | number = Math.floor(utcDate.getTime() / 1000);

      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(match.group.replace(/_/g, " "))
        .setTitle(`${match.homeTeam.name} vs ${match.awayTeam.name}`)
        .setDescription(`<t:${unixTimestamp}:d> <t:${unixTimestamp}:t>`);

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
        .setTitle("🔴 Live: " + match.group.replace(/_/g, " "))
        .setDescription(
          `${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name}`
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
