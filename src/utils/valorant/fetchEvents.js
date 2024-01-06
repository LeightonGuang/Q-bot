const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (interaction) => {
  const year = new Date().getFullYear();
  const vlr_url = "https://vlr.gg";

  const dataFile = fs.readFileSync("data.json");
  const dataObj = JSON.parse(dataFile);

  try {
    const response = await axios.get(vlr_url + "/vct-" + year);
    const html = response.data;
    const $ = cheerio.load(html);

    const eventContainer = $("div.events-container")
      .find("div.events-container-col")
      .first();

    const valorantEventEmbedList = [];

    $(eventContainer)
      .find("a.event-item")
      .each((i, eventBox) => {
        const eventStatus = $(eventBox)
          .find("span.event-item-desc-item-status")
          .text();

        const subCommand = interaction.options.getSubcommand();
        const checkEventStatus = subCommand.split("-")[0];

        if (eventStatus === checkEventStatus) {
          //only get Events
          const eventTitle = $(eventBox)
            .find("div.event-item-title")
            .text()
            .trim();

          let eventUrl = $(eventBox).attr("href");
          eventUrl = vlr_url + eventUrl;

          let eventDate = $(eventBox)
            .find(".event-item-desc-item.mod-dates")
            .first()
            .text()
            .trim();
          eventDate = eventDate.slice(0, -5).trim();

          const monthNum = eventDate.split(" ").length;

          let startDate, endDate;

          if (monthNum === 2) {
            //if theres only 1 month
            const [month, range] = eventDate.split(" ");
            [startDate, endDate] = range.split("—");

            startDate = `${month} ${startDate}`;
            endDate = `${month} ${endDate}`;
          } else if (monthNum === 3) {
            //if there are 2 months
            [startDate, endDate] = eventDate.split("—");

            startDate = startDate.split(" ");
            startDate = `${startDate[0]} ${startDate[1]}`;

            endDate = endDate.split(" ");
            endDate = `${endDate[0]} ${endDate[1]}`;
          }

          let eventImgUrl = $(eventBox).find("img").attr("src");
          eventImgUrl = "https:" + eventImgUrl;

          const newEventObj = {
            eventName: eventTitle,
            eventLogoUrl: eventImgUrl,
            eventPageUrl: eventUrl,
            startDate: startDate,
            endDate: endDate,
            teamList: [],
            upcomingMatchList: [],
          };

          valorantEventEmbedList.push(EventEmbed);

          interaction.editReply({ embeds: valorantEventEmbedList });

          //find the index of the object that is in the list
          let eventListIndex = eventList.findIndex(
            (obj) => obj.eventName === newEventObj.eventName
          );

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
    return;
  } catch (error) {
    console.error(error);
  }
};
