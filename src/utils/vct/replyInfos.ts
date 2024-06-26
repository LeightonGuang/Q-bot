import { EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export const replyInfos: (
  url: string,
  region: string,
  matchType: string
) => Promise<{ embeds: EmbedBuilder[] }> = async (
  url: string,
  region: string,
  matchType: string
) => {
  let embedColour: any;

  type MatchObj = {
    matchPageUrl: string;
    selectedTeamName: string;
    selectedTeamLogoUrl: string;
    selectedTeamPoint: string;
    opponentTeamName: string;
    opponentTeamLogoUrl: string;
    opponentTeamPoint: string;
    date: string;
    time: string;
  };
  let matchDataList: MatchObj[] = [];

  try {
    const { data }: { data: any } = await axios.get(url);
    const $: cheerio.Root = cheerio.load(data);

    matchDataList = $(".team-summary-container-1")
      .find(".wf-card.fc-flex.m-item")
      .map((i, match) => {
        const matchObj: MatchObj = {
          matchPageUrl: "",
          selectedTeamName: "",
          selectedTeamLogoUrl: "",
          selectedTeamPoint: "",
          opponentTeamName: "",
          opponentTeamLogoUrl: "",
          opponentTeamPoint: "",
          date: "",
          time: "",
        };

        matchObj["matchPageUrl"] = "https://vlr.gg" + $(match).attr("href");

        matchObj["selectedTeamName"] = $(match)
          .find(".m-item-team-name")
          .first()
          .text()
          .trim();

        matchObj["selectedTeamLogoUrl"] =
          "https:" + $(match).find(".m-item-logo img").attr("src");

        matchObj["selectedTeamPoint"] = $(match)
          .find(".m-item-result span")
          .first()
          .text()
          .trim();

        matchObj["opponentTeamName"] = $(match)
          .find(".m-item-team-name")
          .last()
          .text()
          .trim();

        matchObj["opponentTeamLogoUrl"] =
          "https:" + $(match).find(".m-item-logo.mod-right img").attr("src");

        matchObj["opponentTeamPoint"] = $(match)
          .find(".m-item-result span")
          .last()
          .text()
          .trim();

        matchObj["date"] = $(match).find(".m-item-date div").text().trim();

        matchObj["time"] = $(match)
          .find(".m-item-date")
          .text()
          .split("\n")[3]
          .trim();
        return matchObj;
      })
      .get();
  } catch (error) {
    console.error(error);
  }

  if (matchType === "upcoming-matches") {
    switch (region) {
      case "americas": {
        embedColour = 0xff570c;
        break;
      }
      case "emea": {
        embedColour = 0xcdf620;
        break;
      }
      case "pacific": {
        embedColour = 0x01d2d7;
        break;
      }
      case "china": {
        embedColour = 0xe73056;
        break;
      }
    }
  }

  let embedList: EmbedBuilder[] = matchDataList.map((matchObj) => {
    const timestamp: number =
      new Date(`${matchObj.date} ${matchObj.time}`).getTime() / 1000;
    let description: string;

    if (matchType === "upcoming-matches") {
      if (matchObj.selectedTeamPoint === matchObj.opponentTeamPoint) {
        // if its a upcoming match
        description = `<t:${timestamp}:d> <t:${timestamp}:t>`;
      } else if (matchObj.selectedTeamPoint !== matchObj.opponentTeamPoint) {
        // if match is finished
        return null;
      }
    } else if (matchType === "results") {
      if (matchObj.selectedTeamPoint !== matchObj.opponentTeamPoint) {
        // if match is finished
        description = `${matchObj.selectedTeamPoint} : ${matchObj.opponentTeamPoint}`;
      } else if (matchObj.selectedTeamPoint === matchObj.opponentTeamPoint) {
        // if its a upcoming match
        return null;
      }
    }

    return new EmbedBuilder()
      .setColor(
        matchType === "upcoming-matches"
          ? embedColour
          : parseInt(matchObj.selectedTeamPoint) >
            parseInt(matchObj.opponentTeamPoint)
          ? 0x43755a
          : 0x785454
      )
      .setAuthor({
        name: matchObj.selectedTeamName,
        iconURL: matchObj.selectedTeamLogoUrl,
      })
      .setTitle(`vs ${matchObj.opponentTeamName} (vlr.gg)`)
      .setURL(matchObj.matchPageUrl)
      .setDescription(description)
      .setThumbnail(matchObj.opponentTeamLogoUrl);
  });

  embedList = embedList.filter((embed) => embed !== null);

  return { embeds: embedList };
};
