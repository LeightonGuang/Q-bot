import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Embed,
} from "discord.js";
import { fetchEvents } from "../../utils/vct/fetchEvents.js";
import { OngoingEvent } from "../../types/OngoingEvent.js";
import { LiveMatchObj } from "../../types/LiveMatchObj.js";
import axios from "axios";
import cheerio from "cheerio";

export const subCommand = async (interaction) => {
  console.log("FILE:\t" + "live-matches.js");

  const replyObj: any = await interaction.reply({
    content: "Fetching live matches...",
    fetchReply: true,
  });

  const vlrUrl: string = "https://vlr.gg";
  const ongoingEventList: OngoingEvent[] = await fetchEvents(
    interaction,
    "ongoing"
  );

  if (ongoingEventList.length === 0) {
    const errorEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no ongoing events right now");

    await interaction.editReply({
      content: "",
      embeds: [errorEmbed],
    });
    return;
  }

  const liveMatchList: LiveMatchObj[] = [];

  for (let event of ongoingEventList) {
    const eventMatchPageUrl: string = event.eventPageUrl.replace(
      "/event/",
      "/event/matches/"
    );

    try {
      const response: any = await axios.get(eventMatchPageUrl);
      const html: string = response.data;
      const $: cheerio.Root = cheerio.load(html);

      $("div.wf-card")
        .find("a.wf-module-item")
        .each((i, day) => {
          const matchStatus = $(day).find("div.ml-status").text();
          let liveMatchObj: LiveMatchObj;

          if (matchStatus === "LIVE") {
            liveMatchObj = {
              matchPageUrl: vlrUrl + $(day).attr("href"),
              team1: "",
              team1Point: "",
              team2: "",
              team2Point: "",
              series: $(day).find("div.match-item-event-series").text().trim(),
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

            liveMatchList.push(liveMatchObj);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  if (liveMatchList.length === 0) {
    const errorEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle("There are no live matches right now");

    await interaction.editReply({
      content: "",
      embeds: [errorEmbed],
    });
    return;
  }

  const scrapeLiveMatch = async (liveMatch, index) => {
    const mapNameList: string[] = [];
    const mapUrlList: string[] = [];
    const groupedMapPointList: string[][] = [];
    const liveMatchEmbedList: EmbedBuilder[] = [];

    try {
      const response: any = await axios.get(liveMatch.matchPageUrl);
      const html: string = response.data;
      const $: cheerio.Root = cheerio.load(html);

      const mapPointList: string[] = [];

      // get all map names to mapNameList
      $("div.vm-stats-gamesnav-container div.vm-stats-gamesnav-item").each(
        (i, mapName) => {
          // skip the first element
          if (i === 0) return;

          let map: string = $(mapName).find("div").text().trim();
          map = map.replace(/[0-9\t\n]/g, "");
          mapNameList.push(map);

          const mapUrl: string = vlrUrl + $(mapName).attr("data-href");
          mapUrlList.push(mapUrl);
        }
      );

      // get points from different page
      $("div.score").each((i, el) => {
        mapPointList.push($(el).text().trim());
      });

      for (let i: number = 0; i < mapPointList.length; i += 2) {
        groupedMapPointList.push([mapPointList[i], mapPointList[i + 1]]);
      }
    } catch (error) {
      console.error(error);
    }

    const liveMatchPointEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(`🔴 ${liveMatch.team1} vs ${liveMatch.team2} (vlr.gg)`)
      .setURL(liveMatch.matchPageUrl)
      .setDescription(
        "Series: " +
          liveMatch.series +
          "\n" +
          `Match:\t${liveMatch.team1Point} - ${liveMatch.team2Point}`
      );
    liveMatchEmbedList.push(liveMatchPointEmbed);

    groupedMapPointList.forEach((mapPoints, i) => {
      const mapName: string = mapNameList[i];
      if (mapPoints.includes("0")) return;

      const liveMapPointEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${mapName}:\t${mapPoints[0]} - ${mapPoints[1]}`);

      const mapPointsSum: number =
        parseInt(mapPoints[0]) + parseInt(mapPoints[1]);
      const mapPointsDiff: number = Math.abs(
        parseInt(mapPoints[0]) - parseInt(mapPoints[1])
      );

      if (
        (mapPointsSum < 25 &&
          (mapPoints[0] === "13" || mapPoints[1] === "13")) ||
        (mapPointsSum > 25 && mapPointsDiff === 2)
      ) {
        // if map is in overtime and score difference is 2
        liveMapPointEmbed.setColor(0x535c65);
      }

      liveMatchEmbedList.push(liveMapPointEmbed);
    });

    const refreshRow: ActionRowBuilder = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Refresh")
        .setCustomId(`vct-refresh-${replyObj.id}`)
        .setStyle(ButtonStyle.Primary)
    );

    if (index === 0) {
      await interaction.editReply({
        content: "",
        embeds: liveMatchEmbedList,
        components: [refreshRow],
        fetchReply: true,
      });
    } else if (index > 0) {
      await interaction.channel.send({
        embeds: liveMatchEmbedList,
        components: [refreshRow],
        fetchReply: true,
      });
    }
  };

  liveMatchList.forEach((liveMatch, i) => {
    // get all map points from match page
    scrapeLiveMatch(liveMatch, i);
  });
};
