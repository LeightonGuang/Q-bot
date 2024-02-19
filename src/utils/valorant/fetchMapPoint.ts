// function fetchMapPoint() {
//   //loop through all the ongoing event
//   for (let i = 0; i < ongoingEventList.length; i++) {
//     let ongoingEvent = ongoingEventList[i];

//     //loop through all the match in
//     for (let j = 0; j < ongoingEvent.upcomingMatchList.length; j++) {
//       //matchObj is each match
//       let matchObj = ongoingEvent.upcomingMatchList[j];

//       let matchUrl = matchObj.matchUrl;
//       matchUrl = matchUrl + "/?game=all&tab=overview";

//       console.log(matchUrl);

//       if (matchObj.matchStatus === "Completed") {
//         //console.log("LOG: \t" + "it is live");
//         let response = await axios.get(matchUrl);
//         const html = response.data;
//         const $ = cheerio.load(html);

//         //get the data-game-id ?game=all&tab=overview
//         //replace all with the data-game-id

//         console.log("matchUrl: " + matchUrl);

//         await axios.get(matchUrl).then((urlResponse) => {
//           const html = urlResponse.data;
//           const $ = cheerio.load(html);

//           let mapNameList = $("div.map").find("span").text().trim();
//           mapNameList = mapNameList.replace(/PICK/g, "");
//           mapNameList = mapNameList.replace(/\t/g, "");
//           mapNameList = mapNameList.split("\n");
//           mapNameList = mapNameList.filter((str) => str !== "");

//           let allMapsPointList = [];

//           $("div.vm-stats-container")
//             .find("div.score")
//             .each((i, scoreElement) => {
//               let score = $(scoreElement).text().trim();
//               allMapsPointList.push(score);
//             });

//           matchObj.mapNameList = mapNameList;
//           matchObj.allMapsPointList = allMapsPointList;

//           console.log(JSON.stringify(mapNameList) + " " + allMapsPointList);
//         });
//       }
//     }
//   }
// }
