import { EmbedBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export const handler = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("FILE: \t" + "eventStringSelectHandler.js");
    if (!interaction.isStringSelectMenu()) return;
    const [selectMenuType, replyId] = interaction.customId.split("-");

    const replyMessage: any = await interaction.channel.messages.fetch(replyId);
    //if it is not a event select menu then end this code file
    if (selectMenuType !== "upcomingEventSelect") return;

    let eventPageUrl: string = interaction.values[0];

    try {
      const { data }: any = await axios.get(eventPageUrl);
      const $: cheerio.Root = cheerio.load(data);

      const matchesLink: any = $("a.wf-nav-item").eq(1);

      eventPageUrl = "https://vlr.gg" + matchesLink.attr("href");
    } catch (error) {
      console.error(error);
    }

    let matchEmbedList: EmbedBuilder[] = [];

    type MatchObj = {
      matchPageUrl: string;
      time: string;
      team1: string;
      team2: string;
      series: string;
    };

    type GroupedMatchObj = {
      date: string;
      matchList: MatchObj[];
    };

    const groupedMatchList: GroupedMatchObj[] = [];

    await axios.get(eventPageUrl).then((response) => {
      const html: string = response.data;
      const $: cheerio.Root = cheerio.load(html);

      const headerElement: any = $("div.event-header");

      const eventLogoUrl: string = headerElement.find("img").attr("src");
      const eventname: string = headerElement.find("h1").text().trim();
      const eventDescription: string = headerElement.find("h2").text().trim();

      const headerEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x9464f5)
        .setTitle(eventname + " Upcoming Matches")
        .setURL(eventPageUrl)
        .setDescription(eventDescription)
        .setThumbnail("https:" + eventLogoUrl);

      // delete select menu
      replyMessage.edit({
        embeds: [headerEmbed],
        components: [],
      });

      // get all the dates
      $("div.wf-label.mod-large").each((i, date) => {
        let filteredDate: any = $(date).text().trim();
        filteredDate = filteredDate.replace(/\n\t+/g, "");
        filteredDate = filteredDate.split(" ");
        if (filteredDate.length === 5) filteredDate.pop();
        filteredDate = filteredDate.join(" ");
        groupedMatchList.push({
          date: filteredDate,
          matchList: [],
        } as GroupedMatchObj);
      });

      // get all the matches in each date
      $("div.wf-card").each((i, groupOfGames) => {
        if (i === 0) return;
        let groupedMatchObj = groupedMatchList[i - 1];
        let matchList = groupedMatchObj.matchList;

        $(groupOfGames)
          .find(".match-item")
          .each((j, match) => {
            const status = $(match).find("div.ml-status").text().trim();
            if (status !== "Upcoming") return;

            const matchObj: MatchObj = {
              matchPageUrl: $(match).attr("href"),
              time: $(match).find("div.match-item-time").text().trim(),
              team1: "",
              team2: "",
              series: $(match)
                .find("div.match-item-event-series")
                .text()
                .trim(),
            };

            $(match)
              .find("div.match-item-vs")
              .find("div.match-item-vs-team")
              .each((k, team) => {
                if (k === 0) {
                  matchObj.team1 = $(team).find("div.text-of").text().trim();
                } else if (k === 1) {
                  matchObj.team2 = $(team).find("div.text-of").text().trim();
                }
              });

            // don't push if both teams are TBD
            if (matchObj.team1 === "TBD" && matchObj.team2 === "TBD") return;
            matchList.push(matchObj);
          });
      });
    });

    groupedMatchList.forEach((groupedMatchObj: GroupedMatchObj) => {
      let { date, matchList }: any = groupedMatchObj;

      let unixDate: Date | number = new Date(date);
      unixDate = unixDate.getTime() / 1000;

      matchList.forEach((matchObj: MatchObj) => {
        const { matchPageUrl, time, team1, team2, series } = matchObj;

        let dateTime: string | Date = date + " " + time;
        dateTime = new Date(dateTime);
        const unixTimestamp = dateTime.getTime() / 1000;

        const matchEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x9464f5)
          .setTitle(`${team1} vs ${team2}`)
          .setURL("https://vlr.gg" + matchPageUrl)
          .setDescription(
            `<t:${unixDate}:d> <t:${unixTimestamp}:t>\nSeries: ${series}`
          );

        matchEmbedList.push(matchEmbed);
        if (matchEmbedList.length === 10) {
          interaction.channel.send({ embeds: matchEmbedList });
          matchEmbedList = [];
        }
      });
    });

    interaction.channel.send({ embeds: matchEmbedList });
  });
};
