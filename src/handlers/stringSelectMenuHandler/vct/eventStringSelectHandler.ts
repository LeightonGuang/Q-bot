import { EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export const handler = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "eventStringSelectHandler.js");
    if (!interaction.isStringSelectMenu()) return;
    const [selectMenuType, replyId] = interaction.customId.split("-");

    //if it is not a event select menu then end this code file
    if (selectMenuType !== "upcomingEventSelect") return;

    let eventPageUrl: string = interaction.values[0];
    eventPageUrl = eventPageUrl.replace(/\/event\//, "/event/matches/");

    const embedList: EmbedBuilder[] = [];

    type MatchObj = {
      matchPageUrl: string;
      team1: string;
      team2: string;
      date: string;
      time: string;
      series: string;
    };

    await axios.get(eventPageUrl).then((response) => {
      const html: string = response.data;
      const $: cheerio.Root = cheerio.load(html);

      const headerElement: any = $("div.event-header");

      const eventLogoUrl: string = headerElement.find("img").attr("src");
      const eventname: string = headerElement.find("h1").text().trim();
      const eventDescription: string = headerElement.find("h2").text().trim();

      const headerEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(eventname + " Upcoming Matches")
        .setURL(eventPageUrl)
        .setDescription(eventDescription)
        .setThumbnail("https:" + eventLogoUrl);

      embedList.push(headerEmbed);

      $("div.wf-card")
        .find("a.wf-module-item")
        .each((i, day) => {
          const matchStatus = $(day).find("div.ml-status").text();

          if (matchStatus !== "Upcoming") return;

          const matchObj: MatchObj = {
            matchPageUrl: "",
            team1: "",
            team2: "",
            date: "",
            time: "",
            series: "",
          };

          $(day)
            .find("div.match-item-vs")
            .find("div.match-item-vs-team")
            .each((i, team) => {
              if (i === 0) {
                matchObj["team1"] = $(team).find("div.text-of").text().trim();
              } else if (i === 1) {
                matchObj["team2"] = $(team).find("div.text-of").text().trim();
              }
            });

          if (matchObj["team1"] === "TBD" && matchObj["team2"] === "TBD")
            return;

          matchObj.matchPageUrl = $(day).attr("href");

          matchObj.series = $(day)
            .find("div.match-item-event-series")
            .text()
            .trim();

          console.log(matchObj);

          const matchEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor(0x9464f5)
            .setTitle(`${matchObj.team1} vs ${matchObj.team2}`)
            .setURL("https://vlr.gg" + matchObj.matchPageUrl)
            .setDescription(matchObj.series);

          embedList.push(matchEmbed);
        });
    });

    // delete select menu
    const replyMessage: any = await interaction.channel.messages.fetch(replyId);
    replyMessage.edit({
      embeds: embedList,
      components: [],
    });
  });
};
