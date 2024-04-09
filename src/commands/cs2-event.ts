import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer-extra";

export const data = {
  data: new SlashCommandBuilder()
    .setName("cs2-event")
    .setDescription("get any tier 1 csgo event ")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ongoing-events")
        .setDescription("csgo events that are ongoing right now.")
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("upcoming-events")
        .setDescription("Upcoming csgo events.")
    ),

  async execute(interaction) {
    function isWebsite(str) {
      const websitePattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
      return websitePattern.test(str);
    }

    const { guild, channel } = interaction;

    const url: string = "https://hltv.org";

    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "ongoing-events": {
        const browser = await (puppeteer as any).launch({
          defaultViewport: { width: 1920, height: 1080 },
          userDataDir: "/home/lg/Documents/github/Q-bot/userData",
          headless: false,
        });

        const page = await browser.newPage();
        // await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20100101 Firefox/6.0"
        );
        await page.goto(url + "/events");
        await page.waitForSelector(".big", { timeout: 30000 });

        await page.screenshot({ path: "screenshot.png", fullPage: true });
        console.log("LOG: \t" + "screenshot");

        const bigEventElementsList = await page.evaluate(() => {
          return Array.from(document.querySelectorAll(".big-event-name"));
        });

        // console.log(bigEventElementsList);

        await browser.close();

        // axios.get(url + "/events").then((urlResponse) => {
        //   //const event = new GuildScheduledEvent();
        //   const ongoingEventEmbedList: EmbedBuilder[] = [];

        //   const ongoingEventHeaderEmbed: EmbedBuilder = new EmbedBuilder()
        //     .setColor(0xff0000)
        //     .setTitle("Ongoing events")
        //     .setDescription("Events taken from HLTV")
        //     .setURL(url);

        //   channel.send({ embeds: [ongoingEventHeaderEmbed] });

        //   //urlResponse.data is the whole html code of that page
        //   const html = urlResponse.data;
        //   const $ = cheerio.load(html);

        //   //Ongoing events
        //   $("#FEATURED")
        //     .find(".ongoing-event-holder")
        //     .find("a")
        //     .each((i, a) => {
        //       const ongoingEventTitle: string = $(a)
        //         .find("div.content.standard-box")
        //         .find("img.logo")
        //         .attr("title");
        //       // console.log(ongoingEventTitle);

        //       const ongoingEventOrganizer: string =
        //         ongoingEventTitle.split(" ")[0];

        //       let ongoingEventDate: string = $(a)
        //         .find("span.col-desc")
        //         .find("span")
        //         .find("span")
        //         .text();
        //       const dateArray: string[] = ongoingEventDate.split(" ");
        //       const dateArrayLength: number = dateArray.length;
        //       ongoingEventDate = `${dateArray[0]} ${dateArray[1]} - ${
        //         dateArray[dateArrayLength - 3]
        //       } ${dateArray[dateArrayLength - 2]}`;
        //       ongoingEventDate = ongoingEventDate.slice(0, -3);
        //       // console.log(ongoingEventDate);

        //       let ongoingEventLink: string = $(a).attr("href");
        //       ongoingEventLink = url + ongoingEventLink;

        //       const ongoingEventOrganizerImgLink: string = $(a)
        //         .find("img.logo")
        //         .attr("src");

        //       const ongoingEventEmbed: EmbedBuilder = new EmbedBuilder()
        //         .setAuthor({
        //           name: ongoingEventOrganizer,
        //           iconURL: ongoingEventOrganizerImgLink,
        //         })
        //         .setColor(0xffffff)
        //         .setTitle(ongoingEventTitle)
        //         .setDescription("Date: " + ongoingEventDate)
        //         .setThumbnail(ongoingEventOrganizerImgLink)
        //         .setURL(ongoingEventLink);

        //       //add all the embeds to the list so they all comes out as one
        //       //ongoingEventEmbedList.push(ongoingEventEmbed);
        //       channel.send({ embeds: [ongoingEventEmbed], fetchReply: true });
        //       // console.log("Ongoing Event(s): \t" + ongoingEventLink);
        //     });
        // });

        await interaction.reply({ content: "Upcomging Event" });
        break;
      }

      case "upcoming-events": {
        const upcomingEventHeaderEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x2b6ea3)
          .setTitle("Upcoming events")
          .setDescription("Events taken from HLTV")
          .setURL(url);

        channel.send({ embeds: [upcomingEventHeaderEmbed] });

        axios.get(url + "/events").then((urlResponse) => {
          //urlResponse.data is the whole html code of that page
          const html = urlResponse.data;
          const $ = cheerio.load(html);

          //loop through each month
          $("div.events-holder").each((i, month) => {
            const upcomingEventsMonthGrid: any = $(month).find("a.big-event");

            //loop through all the event in that month
            $(upcomingEventsMonthGrid).each((i, event) => {
              const upcomingEventTitle: string = $(event)
                .find("div.big-event-name")
                .text();
              //console.log("Events: \t" + upcomingEventTitle);

              const upcomingEventOrganizer: string =
                upcomingEventTitle.split(" ")[0];

              //have to seperate the date because its a mess
              let upcomingEventDate: string = $(event)
                .find("td.col-value.col-date")
                .find("span")
                .text();
              const dateArray: string[] = upcomingEventDate.split(" ");
              const dateArrayLength: number = dateArray.length;
              upcomingEventDate = `${dateArray[0]} ${dateArray[1]} - ${
                dateArray[dateArrayLength - 3]
              } ${dateArray[dateArrayLength - 2]}`;
              upcomingEventDate = upcomingEventDate.slice(0, -3);
              //console.log(upcomingEventDate);

              const upcomingEventLink: string = url + $(event).attr("href");

              //console.log(upcomingEventLink);

              let upcomingEventBannerUrl: string = $(event)
                .find("img.event-header")
                .attr("src");

              if (!isWebsite(upcomingEventBannerUrl)) {
                //if there are no image link set to default image
                upcomingEventBannerUrl =
                  "https://www.hltv.org/img/static/event/1.png";
              }

              const upcomingEventEmbed: EmbedBuilder = new EmbedBuilder()
                .setAuthor({ name: upcomingEventOrganizer })
                .setColor(0xffff00)
                .setTitle(upcomingEventTitle)
                .setDescription("Date: " + upcomingEventDate)
                .setURL(upcomingEventLink)
                .setImage(upcomingEventBannerUrl);

              channel.send({ embeds: [upcomingEventEmbed] });
            });
          });
        });

        await interaction.reply({ content: "Ongoing Event" });
        break;
      }
    }
  },
};
