module.exports = async (eventList) => {
  for (let ongoingEvent of eventList) {
    let eventPageUrl = ongoingEvent.eventPageUrl;

    let matchPageUrl, matchUrl;

    //find match page url
    await axios.get(eventPageUrl).then((urlResponse) => {
      const html = urlResponse.data;
      const $ = cheerio.load(html);

      matchPageUrl = $("a.wf-nav-item:eq(1)").attr("href");
      matchPageUrl = vlr_url + matchPageUrl;
      //console.log("matchPageUrl: " + matchPageUrl);
    });

    //go on match page and find all the match infos
    await axios.get(matchPageUrl).then((urlResponse) => {
      const html = urlResponse.data;
      const $ = cheerio.load(html);

      let eventLogoUrl = $("div.wf-avatar").find("img").attr("src");
      eventLogoUrl = "https:" + eventLogoUrl;

      const eventName = $("h1.wf-title").text().trim();

      let dateList = [];
      let matchStatusList = [];
      $("div.wf-label.mod-large").each((i, date) => {
        let time = $(date).text().trim();
        time = time.substring(time.indexOf(" ") + 1);
        time = time.split(",").join("");
        time = time.split(" ");
        time = `${time[0]} ${time[1]} ${time[2]}`;

        dateList.push(time);
      });

      //console.log(dateList);

      $("div.wf-card").each((index, dayBox) => {
        //every dayBox
        if (index !== 0) {
          //the first wf-card is not dayBox

          //set the matchDate from the list
          let matchDate = dateList[index - 1];

          $(dayBox)
            .find("a.match-item")
            .each((i, matchBox) => {
              //every matchBox

              let teamNameList = $(matchBox)
                .find("div.match-item-vs")
                .find("div.match-item-vs-team")
                .find("div.text-of")
                .text()
                .trim();

              teamNameList = teamNameList.replace(/\t/g, "");
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
              let matchSeries = $(matchBox)
                .find("div.match-item-event-series")
                .text()
                .trim();

              let teamScoreList = $(matchBox)
                .find("div.match-item-vs-team-score")
                .text()
                .trim();

              teamScoreList = teamScoreList.replace(/\t/g, "");
              teamScoreList = teamScoreList.split("\n");
              //console.log(JSON.stringify(teamScoreList));

              let matchTime = $(matchBox)
                .find("div.match-item-time")
                .text()
                .trim();

              matchUrl = $(matchBox).attr("href");
              matchUrl = vlr_url + matchUrl;
              //console.log("matchUrl: " + matchUrl);

              if (team1 !== "TBD" || team2 !== "TBD") {
                //only show if one of them have a team
                let matchObj = {
                  eventName: eventName,
                  eventLogoUrl: eventLogoUrl,
                  matchStatus: matchStatus,
                  matchSeries: matchSeries,
                  team1: team1,
                  team2: team2,
                  teamScoreList: teamScoreList,
                  matchDate: matchDate,
                  matchTime: matchTime,
                  matchUrl: matchUrl,
                };
                ongoingEvent.upcomingMatchList.push(matchObj);
              }
            });
        }
      });
    });
  }
};
