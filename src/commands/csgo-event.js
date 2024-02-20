const {
  SlashCommandBuilder,
  Events,
  GuildScheduledEvent,
  EmbedBuilder,
  Embed,
} = require("discord.js");
const fs = require("fs");
const writeToFile = require("../utils/writeToFile");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("csgo-event")
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

    let url = "https://hltv.org";
    let dataFile = fs.readFileSync("data.json");

    let subCommand = interaction.options.getSubcommand();

    if (subCommand === "ongoing-events") {
      axios.get(url + "/events").then((urlResponse) => {
        //const event = new GuildScheduledEvent();
        let ongoingEventEmbedList = [];

        let ongoingEventHeaderEmbed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("Ongoing events")
          .setDescription("Events taken from HLTV")
          .setURL(url);

        channel.send({ embeds: [ongoingEventHeaderEmbed] });

        //urlResponse.data is the whole html code of that page
        const html = urlResponse.data;
        const $ = cheerio.load(html);

        //Ongoing events
        $("#FEATURED")
          .find(".ongoing-event-holder")
          .find("a")
          .each((i, a) => {
            let ongoingEventTitle = $(a)
              .find("div.content.standard-box")
              .find("img.logo")
              .attr("title");
            console.log(ongoingEventTitle);

            let ongoingEventOrganizer = ongoingEventTitle.split(" ")[0];

            let ongoingEventDate = $(a)
              .find("span.col-desc")
              .find("span")
              .find("span")
              .text();
            let dateArray = ongoingEventDate.split(" ");
            let dateArrayLength = dateArray.length;
            ongoingEventDate = `${dateArray[0]} ${dateArray[1]} - ${
              dateArray[dateArrayLength - 3]
            } ${dateArray[dateArrayLength - 2]}`;
            ongoingEventDate = ongoingEventDate.slice(0, -3);
            console.log(ongoingEventDate);

            let ongoingEventLink = $(a).attr("href");
            ongoingEventLink = url + ongoingEventLink;

            let ongoingEventOrganizerImgLink = $(a)
              .find("img.logo")
              .attr("src");

            let ongoingEventEmbed = new EmbedBuilder()
              .setAuthor({
                name: ongoingEventOrganizer,
                iconURL: ongoingEventOrganizerImgLink,
              })
              .setColor(0xffffff)
              .setTitle(ongoingEventTitle)
              .setDescription("Date: " + ongoingEventDate)
              .setThumbnail(ongoingEventOrganizerImgLink)
              .setURL(ongoingEventLink);

            //add all the embeds to the list so they all comes out as one
            //ongoingEventEmbedList.push(ongoingEventEmbed);
            channel.send({ embeds: [ongoingEventEmbed], fetchReply: true });
            console.log("Ongoing Event(s): \t" + ongoingEventLink);
          });
      });

      await interaction.reply({ content: "Upcomging Event" });
    } else if (subCommand === "upcoming-events") {
      //header embed for upcoming events
      let upcomingEventHeaderEmbed = new EmbedBuilder()
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
          let upcomingEventsMonthGrid = $(month).find("a.big-event");

          //loop through all the event in that month
          $(upcomingEventsMonthGrid).each((i, event) => {
            let upcomingEventTitle = $(event).find("div.big-event-name").text();
            //console.log("Events: \t" + upcomingEventTitle);

            let upcomingEventOrganizer = upcomingEventTitle.split(" ")[0];

            //have to seperate the date because its a mess
            let upcomingEventDate = $(event)
              .find("td.col-value.col-date")
              .find("span")
              .text();
            let dateArray = upcomingEventDate.split(" ");
            let dateArrayLength = dateArray.length;
            upcomingEventDate = `${dateArray[0]} ${dateArray[1]} - ${
              dateArray[dateArrayLength - 3]
            } ${dateArray[dateArrayLength - 2]}`;
            upcomingEventDate = upcomingEventDate.slice(0, -3);
            //console.log(upcomingEventDate);

            let upcomingEventLink = url + $(event).attr("href");

            //console.log(upcomingEventLink);

            let upcomingEventBannerUrl = $(event)
              .find("img.event-header")
              .attr("src");

            if (!isWebsite(upcomingEventBannerUrl)) {
              //if there are no image link set to default image
              upcomingEventBannerUrl =
                "https://www.hltv.org/img/static/event/1.png";
            }

            let upcomingEventEmbed = new EmbedBuilder()
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
    }
  },
};
