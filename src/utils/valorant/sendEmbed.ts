import { EmbedBuilder } from "discord.js";

export const sendEmbed = (interaction, eventList) => {
  const year: number = new Date().getFullYear();
  const valorantEventEmbedList: EmbedBuilder[] = [];
  const { channel } = interaction;

  eventList.forEach((event) => {
    let startDate: any = new Date(`${event.startDate} ${year}`);
    startDate = startDate.getTime() / 1000;

    let endDate: any = new Date(`${event.endDate} ${year}`);
    endDate = endDate.getTime() / 1000;

    let eventEmbed = new EmbedBuilder()
      .setColor(0xff4553)
      .setTitle(event.eventName)
      .setURL(event.eventPageUrl)
      .setThumbnail(event.eventLogoUrl)
      .setDescription(`Date: <t:${startDate}:d> to <t:${endDate}:d>`);

    if (valorantEventEmbedList.length < 10) {
      valorantEventEmbedList.push(eventEmbed);
      interaction.editReply({ embeds: valorantEventEmbedList });
    } else {
      channel.send({ embeds: [eventEmbed] });
    }

    //loop through ever match in that event
    for (let j = 0; j < event.upcomingMatchList.length; j++) {
      let matchObj = event.upcomingMatchList[j];
      //console.log("matchStatusList: " + matchObj.matchStatusList);

      let specificTime: any = new Date(
        `${matchObj.matchDate} ${matchObj.matchTime}`
      );
      specificTime = specificTime.getTime() / 1000;

      const matchEmbed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
          name: matchObj.eventName,
          iconURL: matchObj.eventLogoUrl,
        })
        .setTitle(`${matchObj.team1} vs ${matchObj.team2}`)
        .setURL(matchObj.matchUrl)
        .addFields({
          name: "Time and Date: ",
          value: `<t:${specificTime}>`,
          inline: false,
        })
        .addFields([
          { name: "Status: ", value: matchObj.matchStatus, inline: true },
          { name: "\u200B", value: "\u200B", inline: true },
          { name: "Series: ", value: matchObj.matchSeries, inline: true },
        ]);

      if (matchObj.matchStatus === "Completed") {
        //if the match is completed show the score

        matchEmbed.setColor(0x888888);
        matchEmbed.addFields({
          name: `${matchObj.team1}  vs  ${matchObj.team2}`,
          value: `${matchObj.teamScoreList[0]} - ${matchObj.teamScoreList[1]}`,
          inline: false,
        });

        /* The above code is iterating over an array of map points in a match object. It retrieves
        the map name and map point at each index and adds them as fields to a matchEmbed object.
        If the index is odd, it adds an empty field to create a visual separation between map
        points. */
        //mnIndex is mapNameIndex
        let mnIndex: number = 0;

        for (
          let mpIndex = 0;
          mpIndex < matchObj.allMapsPointList.length;
          mpIndex++
        ) {
          //mpIndex == mapPointIndex

          let map: string = matchObj.mapNameList[mnIndex];
          console.log("map: " + map);
          let mapPoint: string = matchObj.allMapsPointList[mpIndex];
          console.log("mapPoint: " + mapPoint);

          function isOdd(num) {
            return num % 2 !== 0;
          }

          //no need for map name for the second team
          if (isOdd(mpIndex)) {
            map = "\u200B";
            matchEmbed.addFields({
              name: "\u200B",
              value: "\u200B",
              inline: true,
            });
          }

          matchEmbed.addFields([{ name: map, value: mapPoint, inline: true }]);

          if (isOdd(mpIndex)) mnIndex++;
        }
      } else if (matchObj.matchStatus === "LIVE") {
        matchEmbed.setColor(0xff0000);
        matchEmbed.addFields([
          {
            name: matchObj.team1,
            value: matchObj.teamScoreList[0],
            inline: true,
          },
          {
            name: matchObj.team2,
            value: matchObj.teamScoreList[1],
            inline: true,
          },
        ]);

        console.log(matchObj.mapNameList);
      } else if (matchObj.matchStatus === "Upcoming") {
        matchEmbed.setColor(0x5da46c);
        matchEmbed.addFields([
          { name: "Team", value: matchObj.team1, inline: true },
          { name: "Team", value: matchObj.team2, inline: true },
        ]);
      }

      if (valorantEventEmbedList.length < 10) {
        valorantEventEmbedList.push(matchEmbed);
        interaction.editReply({ embeds: valorantEventEmbedList });
      } else {
        channel.send({ embeds: [matchEmbed] });
      }
    }
  });
};
