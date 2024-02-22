import { EmbedBuilder } from "discord.js";
import { fetchEvents } from "../../utils/vct/fetchEvents.js";
import axios from "axios";
import cheerio from "cheerio";

export const subCommand = async (interaction) => {
  console.log("FILE: live-matches.js");
  const year: number = new Date().getFullYear();
  const vlrUrl: string = "https://vlr.gg";

  const liveMatchEmbedList: EmbedBuilder[] = [];

  const liveMatchEmbedHeader: EmbedBuilder = new EmbedBuilder()
    .setColor(0x9464f5)
    .setTitle("Live VCT matches right now");

  liveMatchEmbedList.push(liveMatchEmbedHeader);

  type OngoingEventList = {
    eventName: string;
    eventLogoUrl: string;
    eventPageUrl: string;
    startDate: string;
    endDate: string;
    status: string;
  };

  const ongoingEventList: OngoingEventList[] = await fetchEvents(
    interaction,
    "ongoing"
  );

  if (ongoingEventList.length === 0) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no live matches right now");

    interaction.reply({
      embeds: [errorEmbed],
    });
    return;
  }

  for (let event of ongoingEventList) {
    const eventMatchPageUrl: string = event.eventPageUrl.replace(
      "/event/",
      "/event/matches/"
    );

    try {
      await axios.get(eventMatchPageUrl).then((response) => {
        const html: string = response.data;
        const $: cheerio.Root = cheerio.load(html);

        $("div.wf-card")
          .find("a.wf-module-item")
          .each((i, day) => {
            const matchStatus = $(day).find("div.ml-status").text();

            if (matchStatus === "LIVE") {
              type LiveMatchObj = {
                matchPageUrl: string;
                team1: string;
                team1Point: string;
                team2: string;
                team2Point: string;
                series: string;
              };

              const liveMatchObj: LiveMatchObj = {
                matchPageUrl: $(day).attr("href"),
                team1: "",
                team1Point: "",
                team2: "",
                team2Point: "",
                series: $(day)
                  .find("div.match-item-event-series")
                  .text()
                  .trim(),
              };

              $(day)
                .find("div.match-item-vs")
                .find("div.match-item-vs-team")
                .each((i, team) => {
                  if (i === 0) {
                    liveMatchObj["team1"] = $(team)
                      .find("div.text-of")
                      .text()
                      .trim();

                    liveMatchObj["team1Point"] = $(team)
                      .find("div.match-item-vs-team-score")
                      .text()
                      .trim();
                  } else if (i === 1) {
                    liveMatchObj["team2"] = $(team)
                      .find("div.text-of")
                      .text()
                      .trim();

                    liveMatchObj["team2Point"] = $(team)
                      .find("div.match-item-vs-team-score")
                      .text()
                      .trim();
                  }
                });

              const liveMatchEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(`🔴 ${liveMatchObj.team1} vs ${liveMatchObj.team2}`)
                .setURL(vlrUrl + liveMatchObj.matchPageUrl)
                .setDescription(liveMatchObj.series)
                .addFields(
                  {
                    name: liveMatchObj.team1,
                    value: liveMatchObj.team1Point,
                    inline: true,
                  },
                  { name: "\u200B", value: ":", inline: true },
                  {
                    name: liveMatchObj.team2,
                    value: liveMatchObj.team2Point,
                    inline: true,
                  }
                )
                .setTimestamp();

              liveMatchEmbedList.push(liveMatchEmbed);
            }
          });
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (liveMatchEmbedList.length === 1) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no live matches right now");

    interaction.reply({
      embeds: [errorEmbed],
    });
    return;
  }

  await interaction.reply({
    embeds: liveMatchEmbedList,
  });
};
