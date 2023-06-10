const { SlashCommandBuilder, Events, GuildScheduledEvent, EmbedBuilder, Embed } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');
const axios = require('axios');
const cheerio = require('cheerio');
const { on } = require('events');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("csgo-event")
    .setDescription("get any tier 1 csgo event "),

  async execute(interaction) {

    function isWebsite(str) {
      const websitePattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;
      return websitePattern.test(str);
    }

    const { guild, channel } = interaction;

    let url = "https://hltv.org"
    let dataFile = fs.readFileSync('data.json');

    //const event = new GuildScheduledEvent();
    let ongoingEventEmbedList = [];

    let ongoingEventHeaderEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle("Ongoing events")
      .setDescription("Events taken from HLTV")
      .setURL(url);

    ongoingEventEmbedList.push(ongoingEventHeaderEmbed);

    axios.get(url + "/events").then(urlResponse => {

      //urlResponse.data is the whole html code of that page
      const html = urlResponse.data;
      const $ = cheerio.load(html);

      //Ongoing events
      $("#FEATURED").find(".ongoing-event-holder").find('a').each((i, a) => {

        let ongoingEventTitle = $(a).find("div.content.standard-box").find("img.logo").attr("title");
        console.log(ongoingEventTitle);

        let ongoingEventLink = $(a).attr("href");
        ongoingEventLink = url + ongoingEventLink;

        let ongoingEventImgLink = $(a).find("img.logo").attr("src");

        let ongoingEventEmbed = new EmbedBuilder()
          .setColor(0xFFFFFF)
          .setTitle(ongoingEventTitle)
          .setThumbnail(ongoingEventImgLink)
          .setURL(ongoingEventLink);

        //add all the embeds to the list so they all comes out as one
        //ongoingEventEmbedList.push(ongoingEventEmbed);
        channel.send({ embeds: [ongoingEventEmbed], fetchReply: true });
        console.log("Ongoing Event(s): \t" + ongoingEventLink);
      })

      //===================================================

      let upcomingEventHeaderEmbed = new EmbedBuilder()
        .setColor(0x2b6ea3)
        .setTitle("Upcoming events")
        .setDescription("Events taken from HLTV")
        .setURL(url);

      channel.send({ embeds: [upcomingEventHeaderEmbed] });

      //loop through each month
      $('div.events-holder').each((i, month) => {

        let upcomingEventsMonthGrid = $(month).find("a.big-event");

        //loop through all the event in that month
        $(upcomingEventsMonthGrid).each((i, event) => {
          let upcomingEventTitle = $(event).find("div.big-event-name").text();
          console.log("Events: \t" + upcomingEventTitle);

          let upcomingEventOrganizer = upcomingEventTitle.split(' ')[0];

          //have to seperate the date because its a mess
          let upcomingEventDate = $(event).find("td.col-value.col-date").find("span").text();
          let dateArray = upcomingEventDate.split(' ');
          let dateArrayLength = dateArray.length;
          upcomingEventDate = (`${dateArray[0]} ${dateArray[1]} - ${dateArray[dateArrayLength - 3]} ${dateArray[dateArrayLength - 2]}`);
          upcomingEventDate = upcomingEventDate.slice(0, -3);
          //console.log(upcomingEventDate);

          let upcomingEventLink = url + $(event).attr("href");

          console.log(upcomingEventLink);

          let upcomingEventBannerUrl = $(event)
            .find("img.event-header")
            .attr("src");

          if (!isWebsite(upcomingEventBannerUrl)) {
            //if there are no image link set to default image
            upcomingEventBannerUrl = "https://www.hltv.org/img/static/event/1.png";
          }

          let teamList = [];
          axios.get(upcomingEventLink).then(eventUrl => {
            const html = eventUrl.data;
            const $ = cheerio.load(html);

            teamList = [];
            $("div.teams-attending.grid").find("div.team-box").each((index, team) => {
              let teamName = $(team).find("img").attr("alt");
              teamList.push(teamName);

            });
          });


          console.log(teamList.length);

          let upcomingEventEmbed = new EmbedBuilder()
            .setAuthor({ name: upcomingEventOrganizer })
            .setColor(0xFFFF00)
            .setTitle(upcomingEventTitle)
            .setDescription("Date: " + upcomingEventDate)
            .setURL(upcomingEventLink)
            .setImage(upcomingEventBannerUrl);

          channel.send({ embeds: [upcomingEventEmbed] });
        });
      });
    });

    console.log(JSON.stringify(ongoingEventEmbedList));
    const eventReply = await interaction.reply({ content: `Events`, embeds: ongoingEventEmbedList, ephemeral: false, fetchReply: true });
  },
};
