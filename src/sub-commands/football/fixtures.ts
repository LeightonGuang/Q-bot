import { EmbedBuilder } from "discord.js";
import axios from "axios";
import { convertCountryToEmoji } from "../../utils/football/convertCountryToEmoji.js";

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
      .setAuthor({
        name: competition.name,
        iconURL: competition.emblem,
      })
      .setColor(0xffffff);

    const liveMatches: any[] = matches.filter((match: any) => {
      return (
        (match.status === "IN_PLAY" || match.status === "PAUSED") &&
        (match.homeTeam.name !== null || match.awayTeam.name !== null)
      );
    });

    const liveMatchesList: EmbedBuilder[] = [];

    liveMatches.forEach((match) => {
      let homeFlagEmoji: string = "";
      let awayFlagEmoji: string = "";

      if (competition.name === "European Championship") {
        homeFlagEmoji = convertCountryToEmoji(match.homeTeam.name);
        awayFlagEmoji = convertCountryToEmoji(match.awayTeam.name);
      }

      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🔴 Live: " + match.group.replace(/_/g, " "))
        .setDescription(
          `${homeFlagEmoji} ${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name} ${awayFlagEmoji}`
        );

      liveMatchesList.push(matchEmbed);
    });

    let upcomingMatches: any[] = matches.filter((match: any) => {
      return (
        match.status === "TIMED" &&
        (match.homeTeam.name !== null || match.awayTeam.name !== null)
      );
    });

    if (upcomingMatches.length === 0) {
      const noUpcomingMatches: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("No upcoming matches");
    }

    upcomingMatches = upcomingMatches.slice(0, 5);

    const upcomingMatchesList: EmbedBuilder[] = [];

    upcomingMatches.forEach((match) => {
      const utcDate: Date = new Date(match.utcDate);
      const unixTimestamp: Date | number = Math.floor(utcDate.getTime() / 1000);

      let homeFlagEmoji: string = "";
      let awayFlagEmoji: string = "";

      if (competition.name === "European Championship") {
        homeFlagEmoji = convertCountryToEmoji(match.homeTeam.name);
        awayFlagEmoji = convertCountryToEmoji(match.awayTeam.name);
      }

      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(
          match.group.replace(/_/g, " ") +
            `  ${homeFlagEmoji} ${match.homeTeam.name} vs ${match.awayTeam.name} ${awayFlagEmoji}`
        )
        .setDescription(`<t:${unixTimestamp}:d> <t:${unixTimestamp}:t>`);

      upcomingMatchesList.push(matchEmbed);
    });

    try {
      await interaction.reply({
        embeds: [
          footballHeaderEmbed,
          ...liveMatchesList,
          ...upcomingMatchesList,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
