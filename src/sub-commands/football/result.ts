import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommand = async (interaction, footballDataApiUrl, headers) => {
  const leagueValue: string = interaction.options.get("league").value;

  try {
    const {
      data: { competition, matches },
    }: { data: any; competitions: any; matches: any } = await axios.get(
      footballDataApiUrl + "/competitions/" + leagueValue + "/matches",
      { headers }
    );

    const finishedMatches: any[] = matches.filter((match: any) => {
      return (
        match.status === "FINISHED" &&
        (match.homeTeam.name !== null || match.awayTeam.name !== null)
      );
    });

    let finishedMatchesList: EmbedBuilder[] = [];

    const footballHeaderEmbed = new EmbedBuilder()
      .setAuthor({
        name: competition.name,
        iconURL: competition.emblem,
      })
      .setColor(0xffffff);

    finishedMatches.forEach((match) => {
      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(match.group.replace(/_/g, " "))
        .setDescription(
          `${match.homeTeam.name} ${match.score.halfTime.home} - ${match.score.halfTime.away} ${match.awayTeam.name}`
        );

      finishedMatchesList.push(matchEmbed);
    });

    if (finishedMatchesList.length > 5) {
      // if there are more than 5 matches get the last 5
      finishedMatchesList = finishedMatchesList.slice(-5);
    }

    try {
      await interaction.reply({
        embeds: [footballHeaderEmbed, ...finishedMatchesList],
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
