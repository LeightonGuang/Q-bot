const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (eventList) => {
  let year = new Date().getFullYear();
  let vlr_url = "https://vlr.gg";

  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  const response = await axios.get(vlr_url + "/vct-" + year);
  const html = response.data;
  const $ = cheerio.load(html);

  let eventContainer = $("div.events-container")
    .find("div.events-container-col")
    .first();

  $(eventContainer)
    .find("a.event-item")
    .each((i, eventBox) => {
      let eventStatus = $(eventBox)
        .find("span.event-item-desc-item-status")
        .text();

      let checkEventStatus = subCommand.split("-")[0];

      if (eventStatus === checkEventStatus) {
        //only get Events
        let eventTitle = $(eventBox).find("div.event-item-title").text().trim();

        let eventUrl = $(eventBox).attr("href");
        eventUrl = vlr_url + eventUrl;

        let eventDate = $(eventBox)
          .find(".event-item-desc-item.mod-dates")
          .first()
          .text()
          .trim();
        eventDate = eventDate.slice(0, -5).trim();

        let monthNum = eventDate.split(" ");
        monthNum = monthNum.length;

        let startDate, endDate;

        if (monthNum === 2) {
          //if theres only 1 month
          let [month, range] = eventDate.split(" ");
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

        let newEventObj = {
          eventName: eventTitle,
          eventLogoUrl: eventImgUrl,
          eventPageUrl: eventUrl,
          startDate: startDate,
          endDate: endDate,
          teamList: [],
          upcomingMatchList: [],
        };

        //valorantEventEmbedList.push(EventEmbed);

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
};
