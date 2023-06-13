const { SlashCommandBuilder, Events, GuildScheduledEvent, EmbedBuilder, Embed } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');
const axios = require('axios');
const cheerio = require('cheerio');
const { promises } = require('dns');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valorant-event")
    .setDescription("get any Valorant Champions Tour event schedules")
    .addSubcommand(subcommand =>
      subcommand
        .setName("ongoing-events")
        .setDescription("csgo events that are ongoing right now.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("upcoming-events")
        .setDescription("Upcoming csgo events.")
    ),

  async execute(interaction) {

    const { channel } = interaction;

    let vlr_url = "https://vlr.gg";

    let subCommand = interaction.options.getSubcommand();
    let year = new Date().getFullYear();

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let ongoingEventList = dataObj.events.valorantEvents.ongoingEventList;

    if (subCommand === "ongoing-events") {

      async function fetchOngoingEvents() {
        const response = await axios.get(vlr_url + "/vct-" + year);
        const html = response.data;
        const $ = cheerio.load(html);

        let eventContainer = $("div.events-container").find("div.events-container-col").first();

        let ongoingEventObjList = [];
        $(eventContainer).find("a.event-item").each((i, eventBox) => {

          let eventStatus = $(eventBox).find("span.event-item-desc-item-status").text();

          if (eventStatus === "ongoing") {
            let ongoingEventTitle = $(eventBox).find("div.event-item-title").text().trim();

            let ongoingEventUrl = $(eventBox).attr("href");
            ongoingEventUrl = vlr_url + ongoingEventUrl;

            let ongoingEventDate = $(eventBox).find(".event-item-desc-item.mod-dates").first().text().trim();
            ongoingEventDate = ongoingEventDate.slice(0, -5).trim();

            let ongoingEventImgUrl = $(eventBox).find("img").attr("src");
            ongoingEventImgUrl = "https:" + ongoingEventImgUrl;

            let newOngoingEventObj = {
              "eventName": ongoingEventTitle,
              "eventLogoUrl": ongoingEventImgUrl,
              "eventPageUrl": ongoingEventUrl,
              "date": ongoingEventDate,
              "teamList": [],
              "upcomingMatchList": []
            };

            ongoingEventObjList.push(newOngoingEventObj);

            //find the index of the object that is in the list
            let ongoingEventListIndex = ongoingEventList.findIndex(obj => obj.eventName === newOngoingEventObj.eventName);

            if (ongoingEventListIndex === -1) {
              //if event is not in the list
              ongoingEventList.push(newOngoingEventObj);

            } else {
              //replace old obj with new 
              ongoingEventList.splice(ongoingEventListIndex, 1, newOngoingEventObj);
            }
            writeToFile(dataObj, "data.json");
          }
        });
      }

      async function fetchOngoingEventTeamList() {
        for (let ongoingEvent of ongoingEventList) {
          //loop through all the event in ongoingEventlist
          let eventPageUrl = ongoingEvent.eventPageUrl;

          await axios.get(eventPageUrl).then(urlResponse => {
            const html = urlResponse.data;
            const $ = cheerio.load(html);

            $("div.event-teams-container").find("div.event-team").each((i, teamBox) => {
              let teamName = $(teamBox).find("a.event-team-name").text().trim();

              let teamUrl = $(teamBox).find("a.event-team-name").attr("href");
              teamUrl = vlr_url + teamUrl;

              let teamObj = {
                "teamName": teamName,
                "teamUrl": teamUrl
              };

              try {
                ongoingEvent.teamList.push(teamObj);

              } catch (error) {
                //do it again
                console.log(error);
              }
              writeToFile(dataObj, "data.json");
            });
          });
        }
      }

      async function sendEventEmbed() {
        for (let ongoingEvent of ongoingEventList) {
          //console.log(JSON.stringify(ongoingEvent));

          let ongoingEventEmbed = new EmbedBuilder()
            .setColor(0xFF4553)
            .setTitle(ongoingEvent.eventName)
            .setURL(ongoingEvent.eventPageUrl)
            .setThumbnail(ongoingEvent.eventLogoUrl)
            .setDescription("Date: " + ongoingEvent.date)
            .addFields()

          let fieldTeamlist = [];
          for (let team of ongoingEvent.teamList) {
            //console.log(team);
            let newField = { name: "Team", value: team.teamName, inline: true };
            fieldTeamlist.push(newField);
          }

          ongoingEventEmbed.addFields(fieldTeamlist);

          channel.send({ embeds: [ongoingEventEmbed] });
        }
      }

      await interaction.reply("Valorant Event");
      await fetchOngoingEvents();
      await fetchOngoingEventTeamList();
      await sendEventEmbed();

    } else if (subCommand === "upcoming-events") {
      axios.get(vlr_url + "/vct-" + year).then(urlResponse => {

        const html = urlResponse.data;
        const $ = cheerio.load(html);

        let eventContainer = $("div.events-container").find("div.events-container-col").first();

        $(eventContainer).find("a.event-item").each((i, eventBox) => {

          let eventStatus = $(eventBox).find("span.event-item-desc-item-status").text();

          if (eventStatus === "upcoming") {
            let upcomingEventTitle = $(eventBox).find("div.event-item-title").text();

            let upcomingEventUrl = $(eventBox).attr("href");
            upcomingEventUrl = vlr_url + upcomingEventUrl;

            let upcomingEventDate = $(eventBox).find("div.mod-dates").text();

            let upcomingEventImgUrl = $(eventBox).find("img").attr("src");
            upcomingEventImgUrl = "https:" + upcomingEventImgUrl;

            let upcomingEventEmbed = new EmbedBuilder()
              .setColor(0xFF4553)
              .setTitle(upcomingEventTitle)
              .setURL(upcomingEventUrl)
              .setThumbnail(upcomingEventImgUrl)
              .setDescription(upcomingEventDate)

            channel.send({ embeds: [upcomingEventEmbed] });
          }
        });
      });
    }
  }
}
