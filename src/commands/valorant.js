const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');
const axios = require('axios');
const cheerio = require('cheerio');
const { profile } = require('console');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valorant")
    .setDescription("commands for valorant related stuff")
    .addSubcommand(subcommand =>
      subcommand
        .setName("ongoing-events")
        .setDescription("Ongoing Valorant Champions Tour events.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("upcoming-events")
        .setDescription("Upcoming Valorant Champions Tour events.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("last-rank-game-stats")
        .setDescription("show the stats of your last rank game")
    ),

  async execute(interaction) {

    const { channel } = interaction;

    let vlr_url = "https://vlr.gg";

    let subCommand = interaction.options.getSubcommand();
    let year = new Date().getFullYear();

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    //let ongoingEventList = dataObj.events.valorantEvents.ongoingEventList;

    let valorantEventEmbedList = [];

    let ongoingEventList = [];
    let upcomingEventList = [];

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
            //only get onoing Events
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

            //valorantEventEmbedList.push(ongoingEventEmbed);

            interaction.editReply({ embeds: valorantEventEmbedList });

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

      async function fetchEventMatch() {
        for (let ongoingEvent of ongoingEventList) {
          let eventPageUrl = ongoingEvent.eventPageUrl;

          let matchPageUrl, matchUrl;


          //find match page url
          await axios.get(eventPageUrl).then(urlResponse => {
            const html = urlResponse.data;
            const $ = cheerio.load(html);

            matchPageUrl = $("a.wf-nav-item:eq(1)").attr("href");
            matchPageUrl = vlr_url + matchPageUrl;
            //console.log("matchPageUrl: " + matchPageUrl);
          });

          //go on match page and find all the match infos
          await axios.get(matchPageUrl).then(urlResponse => {
            const html = urlResponse.data;
            const $ = cheerio.load(html);

            let eventLogoUrl = $("div.wf-avatar").find("img").attr("src");
            eventLogoUrl = "https:" + eventLogoUrl;

            const eventName = $("h1.wf-title").text().trim();

            let dateList = [];
            let matchStatusList = [];
            $("div.wf-label.mod-large").each((i, date) => {
              let time = $(date).text().trim();
              time = time.substring(time.indexOf(' ') + 1);
              time = time.split(',').join('');
              time = time.split(' ');
              time = `${time[0]} ${time[1]} ${time[2]}`;

              dateList.push(time);
            })

            //console.log(dateList);

            $("div.wf-card").each((index, dayBox) => {
              //every dayBox
              if (index !== 0) {
                //the first wf-card is not dayBox

                //set the matchDate from the list
                let matchDate = dateList[index - 1];

                $(dayBox).find("a.match-item").each((i, matchBox) => {
                  //every matchBox

                  let teamNameList = $(matchBox)
                    .find("div.match-item-vs")
                    .find("div.match-item-vs-team")
                    .find("div.text-of")
                    .text().trim();

                  teamNameList = teamNameList.replace(/\t/g, '');
                  teamNameList = teamNameList.split(/\n+/);

                  //console.log(JSON.stringify(teamNameList));

                  //teamName = teamName.split(' ');
                  let team1 = teamNameList[0];
                  let team2 = teamNameList[1];
                  //console.log(team1 + " and " + team2);

                  //matchStatusList is a global variable list
                  matchStatusList.push($(matchBox).find("div.ml-status").text());

                  let matchStatus = $(matchBox).find("div.ml-status").text();
                  //console.log(matchStatusList);

                  //round 1, quater final, finals etc
                  let matchSeries = $(matchBox).find("div.match-item-event-series").text().trim();

                  let teamScoreList = $(matchBox).find("div.match-item-vs-team-score").text().trim();

                  teamScoreList = teamScoreList.replace(/\t/g, '');
                  teamScoreList = teamScoreList.split("\n");
                  //console.log(JSON.stringify(teamScoreList));

                  let matchTime = $(matchBox).find("div.match-item-time").text().trim();

                  matchUrl = $(matchBox).attr("href");
                  matchUrl = vlr_url + matchUrl;
                  //console.log("matchUrl: " + matchUrl);

                  if (team1 !== "TBD" || team2 !== "TBD") {
                    //only show if one of them have a team
                    let matchObj = {
                      "eventName": eventName,
                      "eventLogoUrl": eventLogoUrl,
                      "matchStatus": matchStatus,
                      "matchSeries": matchSeries,
                      "team1": team1,
                      "team2": team2,
                      "teamScoreList": teamScoreList,
                      "matchDate": matchDate,
                      "matchTime": matchTime,
                      "matchUrl": matchUrl
                    }
                    ongoingEvent.upcomingMatchList.push(matchObj);
                  }
                });
              }
            });
          });
        }
      }

      async function fetchOngoingEventTeamList() {
        for (let ongoingEvent of ongoingEventList) {
          //loop through all the event in ongoingEventList
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

      async function fetchMapPoint() {

        let mapUrlList = [];

        //loop through all the ongoing event
        for (let i = 0; i < ongoingEventList.length; i++) {
          let ongoingEvent = ongoingEventList[i];

          //loop through all the match in 
          for (let j = 0; j < ongoingEvent.upcomingMatchList.length; j++) {
            let matchObj = ongoingEvent.upcomingMatchList[j];

            let matchUrl = matchObj.matchUrl;

            //console.log(matchUrl);

            if (i !== 0 && matchObj.matchStatus === "Completed") {
              await axios.get(matchUrl).then(urlResponse => {
                const html = urlResponse.data;
                const $ = cheerio.load(html);

                console.log("matchUrl: " + matchUrl);

                let mapBox = $("div.vm-stats-gamesnav-item");

                console.log(mapBox);

                //get all the map box
                $(mapBox).each((i, mapBox) => {
                  let mapUrl = $(mapBox).attr("data-href");
                  mapUrl = vlr_url + mapUrl;
                  console.log("mapUrl: " + mapUrl);

                  mapUrlList.push(matchUrl);
                })
              })
            }
          }
        }

        console.log("mapUrlList: " + mapUrlList);

        for (let mapUrl of mapUrlList) {
          await axios.get(mapUrl).then(urlResponse => {
            const html = urlResponse.data;
            const $ = cheerio.load(html);

            let mapPoint = $("div.vm-stats-container").find("div.score").text().trim();
            console.log(mapPoint);
          })
        }

      }

      async function sendEventEmbed() {
        for (let i = 0; i < ongoingEventList.length; i++) {
          //console.log(JSON.stringify(ongoingEvent));

          let ongoingEvent = ongoingEventList[i];

          let ongoingEventEmbed = new EmbedBuilder()
            .setColor(0xFF4553)
            .setTitle(ongoingEvent.eventName)
            .setURL(ongoingEvent.eventPageUrl)
            .setThumbnail(ongoingEvent.eventLogoUrl)
            .setDescription("Date: " + ongoingEvent.date)
          //.addFields({ name: "Teams: ", value: "\u200B" })

          /*add field to teams to the event embed
          let fieldTeamlist = [];
          for (let team of ongoingEvent.teamList) {
            //console.log(team);
            let newField = { name: "\u200B", value: `[${team.teamName}](${team.teamUrl})`, inline: true };
            fieldTeamlist.push(newField);
          }
          ongoingEventEmbed.addFields(fieldTeamlist);
   
          */

          if (valorantEventEmbedList.length < 10) {
            valorantEventEmbedList.push(ongoingEventEmbed)
            interaction.editReply({ embeds: valorantEventEmbedList });

          } else {
            channel.send({ embeds: [ongoingEventEmbed] });
          }

          for (let j = 0; j < ongoingEvent.upcomingMatchList.length; j++) {
            let matchObj = ongoingEvent.upcomingMatchList[j];
            //console.log("matchStatusList: " + matchObj.matchStatusList);

            let specificTime = new Date(`${matchObj.matchDate} ${matchObj.matchTime}`);
            specificTime = specificTime.getTime() / 1000;

            let matchEmbed = new EmbedBuilder()
              .setAuthor({ name: matchObj.eventName, iconURL: matchObj.eventLogoUrl })
              .setTitle(`${matchObj.team1} vs ${matchObj.team2}`)
              .setURL(matchObj.matchUrl)
              .addFields({ name: "Time and Date: ", value: `<t:${specificTime}>`, inline: false })
              .addFields([
                { name: "Status: ", value: matchObj.matchStatus, inline: true },
                { name: "\u200B", value: "\u200B", inline: true },
                { name: "Series: ", value: matchObj.matchSeries, inline: true }
              ])

            if (matchObj.matchStatus === "Completed") {
              //if the match is completed show the score
              matchEmbed.setColor(0x888888)
              matchEmbed.addFields([
                { name: matchObj.team1, value: matchObj.teamScoreList[0], inline: true },
                { name: matchObj.team2, value: matchObj.teamScoreList[1], inline: true }
              ])

            } else if (matchObj.matchStatus === "LIVE") {
              matchEmbed.setColor(0xFF0000)
              matchEmbed.addFields([
                { name: matchObj.team1, value: matchObj.teamScoreList[0], inline: true },
                { name: matchObj.team2, value: matchObj.teamScoreList[1], inline: true }
              ])

            } else if (matchObj.matchStatus === "Upcoming") {
              matchEmbed.setColor(0x5da46c)
              matchEmbed.addFields([
                { name: "Team", value: matchObj.team1, inline: true },
                { name: "Team", value: matchObj.team2, inline: true }
              ])
            }

            if (valorantEventEmbedList.length < 10) {
              valorantEventEmbedList.push(matchEmbed)
              interaction.editReply({ embeds: valorantEventEmbedList });

            } else {
              channel.send({ embeds: [matchEmbed] });
            }
          }
        }
      }

      let ongoingEventEmbedHeader = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("Ongoing Valorant Champions Tour " + year)
        .setURL(vlr_url + "/vct-" + year)
        .setDescription("Riot's official " + year + " Valorant tournament circuit")

      valorantEventEmbedList.push(ongoingEventEmbedHeader);

      await interaction.reply({ embeds: valorantEventEmbedList, fetchReply: true });

      await fetchOngoingEvents();
      await fetchEventMatch();
      //await fetchOngoingEventTeamList();
      await fetchMapPoint();
      await sendEventEmbed();

    } else if (subCommand === "upcoming-events") {

      let ongoingEventEmbedHeader = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("Upcoming Valorant Champions Tour " + year)
        .setURL(vlr_url + "/vct-" + year)
        .setDescription("Riot's official " + year + " Valorant tournament circuit")

      valorantEventEmbedList.push(ongoingEventEmbedHeader);

      await interaction.reply({ embeds: valorantEventEmbedList, fetchReply: true });

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
              .setColor(0xc6b274)
              .setTitle(upcomingEventTitle)
              .setURL(upcomingEventUrl)
              .setThumbnail(upcomingEventImgUrl)
              .setDescription(upcomingEventDate)

            channel.send({ embeds: [upcomingEventEmbed] });
          }
        });
      });

    } else if (subCommand === "last-rank-game-stats") {
      function profileUrl(riotId) {
        let modifiedId = riotId.replace(/\s+/g, "%20");
        modifiedId = modifiedId.replace(/#/g, "%23");

        //console.log(modifiedId);

        return "https://tracker.gg/valorant/profile/riot/" + modifiedId + "/overview";
      }

      let riotId = dataObj.playerList[2].riotId;
      //console.log(riotId);
      //console.log(profileUrl(riotId));
      let trackerProfileUrl = profileUrl(riotId);
    }
  }
}
