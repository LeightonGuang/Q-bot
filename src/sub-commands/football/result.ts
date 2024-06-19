import { EmbedBuilder } from "discord.js";
import axios from "axios";
import { convertCountryToEmoji } from "../../utils/football/convertCountryToEmoji.js";

export const subCommand = async (interaction, footballDataApiUrl, headers) => {
  const leagueValue: string = interaction.options.get("league").value;

  try {
    let {
      data: { competition, matches },
    }: { data: any; competitions: any; matches: any } = await axios.get(
      footballDataApiUrl +
        "/competitions/" +
        leagueValue +
        "/matches?status=FINISHED",
      { headers }
    );

    if (matches.length > 5) {
      // if there are more than 5 matches get the last 5
      matches = matches.slice(-5);
    }

    matches.reverse();

    const finishedMatchesList: EmbedBuilder[] = [];

    const footballHeaderEmbed = new EmbedBuilder()
      .setTitle(competition.name)
      .setThumbnail(competition.emblem)
      .setColor(0xffffff);

    matches.forEach((match) => {
      let homeFlagEmoji: string = "";
      let awayFlagEmoji: string = "";

      if (competition.name === "European Championship") {
        homeFlagEmoji = convertCountryToEmoji(match.homeTeam.name);
        awayFlagEmoji = convertCountryToEmoji(match.awayTeam.name);
      }

      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(match.group.replace(/_/g, " "))
        .setDescription(
          `${homeFlagEmoji} ${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name} ${awayFlagEmoji}`
        );

      finishedMatchesList.push(matchEmbed);
    });

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
