import { EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export const replyInfos: (
  url: string,
  region: string
) => Promise<{ embeds: EmbedBuilder[] }> = async (
  url: string,
  region: string
) => {
  let regionColour: any;

  switch (region) {
    case "americas": {
      regionColour = 0xff570c;
      break;
    }
    case "emea": {
      regionColour = 0xcdf620;
      break;
    }
    case "pacific": {
      regionColour = 0x01d2d7;
      break;
    }
  }
  type MatchObj = {
    matchPageUrl: string;
    selectedTeamName: string;
    selectedTeamLogoUrl: string;
    opponentTeamName: string;
    opponentTeamLogoUrl: string;
    date: string;
    time: string;
  };
  let matchDataList: MatchObj[] = null;

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
          opponentTeamName: "",
          opponentTeamLogoUrl: "",
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

        matchObj["opponentTeamName"] = $(match)
          .find(".m-item-team-name")
          .last()
          .text()
          .trim();

        matchObj["opponentTeamLogoUrl"] =
          "https:" + $(match).find(".m-item-logo.mod-right img").attr("src");

        matchObj["date"] = $(match).find(".m-item-date div").text().trim();

        matchObj["time"] = $(match)
          .find(".m-item-date")
          .text()
          .split("\n")[3]
          .trim();
        return matchObj;
      })
      .get()
      .slice(0, 5);
  } catch (error) {
    console.error(error);
  }

  const embedList: EmbedBuilder[] = matchDataList.map((matchObj) => {
    const timestamp: number =
      new Date(`${matchObj.date} ${matchObj.time}`).getTime() / 1000;

    return new EmbedBuilder()
      .setColor(regionColour)
      .setAuthor({
        name: matchObj.selectedTeamName,
        iconURL: matchObj.selectedTeamLogoUrl,
      })
      .setTitle(`vs ${matchObj.opponentTeamName} (vlr.gg)`)
      .setURL(matchObj.matchPageUrl)
      .setDescription(`<t:${timestamp}:d> <t:${timestamp}:t>`)
      .setThumbnail(matchObj.opponentTeamLogoUrl);
  });

  return { embeds: embedList };
};
