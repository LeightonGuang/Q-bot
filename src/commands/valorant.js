const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const writeToFile = require('../utils/writeToFile');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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
        .setName("check-rank")
        .setDescription("check current rank and peak rank")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself"))
    ),

  async execute(interaction) {

    async function fetchEvents(eventList) {

      const response = await axios.get(vlr_url + "/vct-" + year);
      const html = response.data;
      const $ = cheerio.load(html);

      let eventContainer = $("div.events-container").find("div.events-container-col").first();

      $(eventContainer).find("a.event-item").each((i, eventBox) => {

        let eventStatus = $(eventBox).find("span.event-item-desc-item-status").text();

        let checkEventStatus = subCommand.split('-')[0];

        if (eventStatus === checkEventStatus) {
          //only get Events
          let eventTitle = $(eventBox).find("div.event-item-title").text().trim();

          let eventUrl = $(eventBox).attr("href");
          eventUrl = vlr_url + eventUrl;

          let eventDate = $(eventBox).find(".event-item-desc-item.mod-dates").first().text().trim();
          eventDate = eventDate.slice(0, -5).trim();

          let monthNum = eventDate.split(' ');
          monthNum = monthNum.length;

          let startDate, endDate;

          if (monthNum === 2) {
            //if theres only 1 month
            let [month, range] = eventDate.split(' ');
            [startDate, endDate] = range.split('—');

            startDate = `${month} ${startDate}`;
            endDate = `${month} ${endDate}`;

          } else if (monthNum === 3) {
            //if there are 2 months
            [startDate, endDate] = eventDate.split('—');

            startDate = startDate.split(' ');
            startDate = `${startDate[0]} ${startDate[1]}`;

            endDate = endDate.split(' ');
            endDate = `${endDate[0]} ${endDate[1]}`;
          }

          let eventImgUrl = $(eventBox).find("img").attr("src");
          eventImgUrl = "https:" + eventImgUrl;

          let newEventObj = {
            "eventName": eventTitle,
            "eventLogoUrl": eventImgUrl,
            "eventPageUrl": eventUrl,
            "startDate": startDate,
            "endDate": endDate,
            "teamList": [],
            "upcomingMatchList": []
          };

          //valorantEventEmbedList.push(EventEmbed);

          interaction.editReply({ embeds: valorantEventEmbedList });

          //find the index of the object that is in the list
          let eventListIndex = eventList.findIndex(obj => obj.eventName === newEventObj.eventName);

          if (eventListIndex === -1) {
            //if event is not in the list
            eventList.push(newEventObj);

          } else {
            //replace old obj with new 
            eventList.splice(eventListIndex, 1, newEventObj);
          }
          writeToFile(dataObj, "data.json");
        }
      });
    }

    async function fetchEventMatch(eventList) {
      for (let ongoingEvent of eventList) {
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

    async function sendEmbed(eventList) {
      for (let i = 0; i < eventList.length; i++) {
        //console.log(JSON.stringify(event));

        let event = eventList[i];

        let startDate = new Date(`${event.startDate} ${year}`);
        startDate = startDate.getTime() / 1000;


        let endDate = new Date(`${event.endDate} ${year}`);
        endDate = endDate.getTime() / 1000;

        let eventEmbed = new EmbedBuilder()
          .setColor(0xFF4553)
          .setTitle(event.eventName)
          .setURL(event.eventPageUrl)
          .setThumbnail(event.eventLogoUrl)
          .setDescription(`Date: <t:${startDate}:d> to <t:${endDate}:d>`)

        if (valorantEventEmbedList.length < 10) {
          valorantEventEmbedList.push(eventEmbed)
          interaction.editReply({ embeds: valorantEventEmbedList });

        } else {
          channel.send({ embeds: [eventEmbed] });
        }

        //loop through ever match in that event
        for (let j = 0; j < event.upcomingMatchList.length; j++) {
          let matchObj = event.upcomingMatchList[j];
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

            matchEmbed.setColor(0x888888);
            matchEmbed.addFields([
              { name: matchObj.team1, value: matchObj.teamScoreList[0], inline: true },
              { name: matchObj.team2, value: matchObj.teamScoreList[1], inline: true }
            ]);

          } else if (matchObj.matchStatus === "LIVE") {
            matchEmbed.setColor(0xFF0000);
            matchEmbed.addFields([
              { name: matchObj.team1, value: matchObj.teamScoreList[0], inline: true },
              { name: matchObj.team2, value: matchObj.teamScoreList[1], inline: true }
            ]);

            console.log(matchObj.mapNameList);

          } else if (matchObj.matchStatus === "Upcoming") {
            matchEmbed.setColor(0x5da46c);
            matchEmbed.addFields([
              { name: "Team", value: matchObj.team1, inline: true },
              { name: "Team", value: matchObj.team2, inline: true }
            ]);
          }

          if (valorantEventEmbedList.length < 10) {
            valorantEventEmbedList.push(matchEmbed);
            interaction.editReply({ embeds: valorantEventEmbedList });

          } else {
            channel.send({ embeds: [matchEmbed] });
          }
        }
      }
    }

    const { channel } = interaction;

    let vlr_url = "https://vlr.gg";

    let subCommand = interaction.options.getSubcommand();
    let year = new Date().getFullYear();

    let dataFile = fs.readFileSync("data.json");
    let dataObj = JSON.parse(dataFile);

    let valorantEventEmbedList = [];

    let ongoingEventList = [];
    let upcomingEventList = [];

    if (subCommand === "ongoing-events") {

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
        //loop through all the ongoing event
        for (let i = 0; i < ongoingEventList.length; i++) {
          let ongoingEvent = ongoingEventList[i];

          //loop through all the match in 
          for (let j = 0; j < ongoingEvent.upcomingMatchList.length; j++) {
            //matchObj is each match
            let matchObj = ongoingEvent.upcomingMatchList[j];

            let matchUrl = matchObj.matchUrl;
            matchUrl = matchUrl + "/?game=all&tab=overview";

            console.log(matchUrl);

            if (matchObj.matchStatus === "Completed") {
              console.log("LOG: \t" + "it is live");
              let response = await axios.get(matchUrl);
              const html = response.data;
              const $ = cheerio.load(html);

              //get the data-game-id ?game=all&tab=overview
              //replace all with the data-game-id

              console.log("matchUrl: " + matchUrl);

              await axios.get(matchUrl).then(urlResponse => {
                const html = urlResponse.data;
                const $ = cheerio.load(html);

                let mapNameList = $("div.map").find("span").text().trim();
                mapNameList = mapNameList.replace(/PICK/g, '');
                mapNameList = mapNameList.replace(/\t/g, '');
                mapNameList = mapNameList.split("\n");
                mapNameList = mapNameList.filter(str => str !== '');

                let allMapsPointList = [];

                $("div.vm-stats-container").find("div.score").each((i, scoreElement) => {
                  let score = $(scoreElement).text().trim();
                  allMapsPointList.push(score);
                });

                matchObj.mapNameList = mapNameList;
                matchObj.allMapsPointList = allMapsPointList;

                console.log(JSON.stringify(mapNameList) + " " + allMapsPointList);
              });
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

      await fetchEvents(ongoingEventList);
      await fetchEventMatch(ongoingEventList);
      //await fetchOngoingEventTeamList();
      await fetchMapPoint();
      await sendEmbed(ongoingEventList);

    } else if (subCommand === "upcoming-events") {

      let upcomingEventEmbedHeader = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("Upcoming Valorant Champions Tour " + year)
        .setURL(vlr_url + "/vct-" + year)
        .setDescription("Riot's official " + year + " Valorant tournament circuit")

      valorantEventEmbedList.push(upcomingEventEmbedHeader);

      await interaction.reply({ embeds: valorantEventEmbedList, fetchReply: true });

      await fetchEvents(upcomingEventList);
      await fetchEventMatch(upcomingEventList);
      await sendEmbed(upcomingEventList);

    } else if (subCommand === "check-rank") {

      //list that stores the current rank and peak rank embed
      let rankEmbedList = [];

      function profileUrl(riotId) {
        let modifiedId = riotId.replace(/\s+/g, "%20");
        modifiedId = modifiedId.replace(/#/g, "%23");

        //console.log(modifiedId);

        let playerUrl = "https://tracker.gg/valorant/profile/riot/" + modifiedId + "/overview";
        //console.log(playerUrl);
        return playerUrl;
      }

      let userId = interaction.options.getMember("player");

      //if the command is left empty
      if (userId === null) {
        userId = interaction.user.id;

      } else {
        userId = userId.id;
      }

      let userObj = dataObj.playerList.find(obj => obj.id === userId);
      let riotId = userObj.riotId;

      let statEmbedHeader = new EmbedBuilder()
        .setTitle("Riot ID: " + riotId)

      rankEmbedList.push(statEmbedHeader);
      let trackerProfileUrl = profileUrl(riotId);

      async function getRank() {

        function getRankColour(rank) {
          if (rank === "Iron") {
            return 0x3c3c3c;

          } else if (rank === "Bronze") {
            return 0xa5855e;

          } else if (rank === "Silver") {
            return 0xcdd3d1;

          } else if (rank === "Gold") {
            return 0xebca52;

          } else if (rank === "Platinum") {
            return 0x49a6b7;

          } else if (rank === "Diamond") {
            return 0xd681e9;

          } else if (rank === "Ascendant") {
            return 0x58a861;

          } else if (rank === "Immortal") {
            return 0xb13138;

          } else if (rank === "Radiant") {
            return 0xf5f4df;

          } else {
            return 0x000000;
          }
        }

        const browser = await puppeteer.launch({
          //headless: false,
          //args: ['--disable-setuid-sandbox', '--disable-extensions']
        });
        const page = await browser.newPage();
        await page.goto(trackerProfileUrl);

        await page.screenshot({ path: "trackergg.png", fullPage: true });
        console.log("LOG: \t" + "screenshot");

        const currentRankImgElement = await page.$("#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-icon > img");
        const currentRankNameElement = await page.$("#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-info > div.value");

        let currentRankImgUrl, currentRankName;

        if (currentRankImgElement) {
          currentRankImgUrl = await page.evaluate(element => element.src, currentRankImgElement);
          //console.log(currentRankImgUrl);
        }

        if (currentRankNameElement) {
          currentRankName = await page.evaluate(element => element.textContent, currentRankNameElement);
          //console.log(currentRankName);
        }

        let currentRankEmbedColour = currentRankName.trim().split(' ');
        currentRankEmbedColour = currentRankEmbedColour[0];
        console.log(currentRankEmbedColour);
        currentRankEmbedColour = getRankColour(currentRankEmbedColour);

        let currentRankEmbed = new EmbedBuilder()
          .setColor(currentRankEmbedColour)
          .setAuthor({ name: "Current Rank:" })
          .setTitle(currentRankName)
          .setThumbnail(currentRankImgUrl)

        rankEmbedList.push(currentRankEmbed);
        interaction.editReply({ embeds: rankEmbedList });

        const peakRankImgElement = await page.$("#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div.rating-summary__content.rating-summary__content--secondary > div > div > div > div > div.rating-entry__rank-icon > img");
        const peakRankNameElement = await page.$("#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div.rating-summary__content.rating-summary__content--secondary > div > div > div > div > div.rating-entry__rank-info > div.value");

        let peakRankImgUrl, peakRankName;

        if (peakRankImgElement) {
          peakRankImgUrl = await page.evaluate(element => element.src, peakRankImgElement);
        }

        if (peakRankNameElement) {
          peakRankName = await page.evaluate(element => element.textContent, peakRankNameElement);
        }

        let peakRankEmbedColour = peakRankName.trim().split(' ');
        peakRankEmbedColour = peakRankEmbedColour[0];
        console.log(peakRankEmbedColour);
        peakRankEmbedColour = getRankColour(peakRankEmbedColour);

        let peakRankEmbed = new EmbedBuilder()
          .setColor(peakRankEmbedColour)
          .setAuthor({ name: "Peak Rank: " })
          .setTitle(peakRankName)
          .setThumbnail(peakRankImgUrl)

        rankEmbedList.push(peakRankEmbed);
        interaction.editReply({ embeds: rankEmbedList });

        await browser.close();
      }

      getRank();
      console.log(rankEmbedList);
      await interaction.reply({ embeds: rankEmbedList, fetchReply: true });

    }
  }
}