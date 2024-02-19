// import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

export const fetchEvents = async (interaction) => {
  const year: number = new Date().getFullYear();
  const vlr_url: string = "https://vlr.gg";

  const eventList: object[] = [];

  const { data } = await axios.get(vlr_url + "/vct-" + year);
  const $ = cheerio.load(data);

  const eventContainer = $("div.events-container")
    .find("div.events-container-col")
    .first();

  $(eventContainer)
    .find("a.event-item")
    .each((_i, eventBox) => {
      const eventStatus: string = $(eventBox)
        .find("span.event-item-desc-item-status")
        .text();

      const checkEventStatus: string = interaction.options
        .getSubcommand()
        .split("-")[0];

      console.log("checkEventStatus: " + checkEventStatus);

      if (eventStatus === checkEventStatus) {
        //only get Events
        const eventTitle: string = $(eventBox)
          .find("div.event-item-title")
          .text()
          .trim();

        let eventUrl: string = $(eventBox).attr("href");
        eventUrl = vlr_url + eventUrl;

        let eventDate: string = $(eventBox)
          .find(".event-item-desc-item.mod-dates")
          .first()
          .text()
          .trim();
        eventDate = eventDate.slice(0, -5).trim();

        let monthNum: number = eventDate.split(" ").length;
        let startDate: any, endDate: any;

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

        eventList.push(newEventObj);
      }
    });
  return eventList;
};
