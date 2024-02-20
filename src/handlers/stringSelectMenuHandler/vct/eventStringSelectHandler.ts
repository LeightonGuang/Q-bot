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
    const matchObjList: object[] = [];

    await axios.get(eventPageUrl).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const header: any = $("div.event-header");

      const eventLogoUrl: string = header.find("img").attr("src");
      const eventname: string = header.find("h1").text().trim();
      const eventDescription: string = header.find("h2").text().trim();

      const headerEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(eventname + " Upcoming Matches")
        .setURL(eventPageUrl)
        .setDescription(eventDescription)
        .setThumbnail("https:" + eventLogoUrl);

      embedList.push(headerEmbed);

      $("div.wf-card")
        .find("a")
        .each((i, day) => {
          if (i === 0) return;

          const matchObj: object = {
            team1: "",
            team2: "",
            date: "",
            time: "",
            score: "",
            matchStatus: "",
          };

          $(day).find("div.ml-status");
          const matchStatus = $("div.ml-status").text();

          if (matchStatus !== "Upcoming") return;

          let team = $(day).find("match-item-vs-team-name").text();
          console.log("team1: " + team);
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
