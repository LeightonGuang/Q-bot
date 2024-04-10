import { EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;

  const replyInfos: any = async (url: string) => {
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
        .setColor(0xff570c)
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

  switch (team) {
    case "SEN": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2/sentinels"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "C9": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/188/cloud9"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "G2": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11058/g2-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "KRÜ": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2355/kr-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "NRG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1034/nrg-esports"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "LEV": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2359/leviat-n"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "LOUD": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/6961/loud"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "100T": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/120/100-thieves"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "MIBR": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/7386/mibr"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FUR": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2406/furia"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "EG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/5248/evil-geniuses"
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
