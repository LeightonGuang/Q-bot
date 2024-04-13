import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import axios from "axios";
import cheerio from "cheerio";

export const handler: any = async (interaction) => {
  console.log("FILE: \t" + "liveMatchRefreshButtonhandler.js");

  const [command, button]: string[] = interaction.customId.split("-");

  if (command !== "vct") return;

  const vlrUrl: string = "https://vlr.gg";
  const liveMatchEmbedList: EmbedBuilder[] = [];
  const liveMatchEmbed: EmbedBuilder = interaction.message.embeds;

  const {
    url: matchPageUrl,
    title,
    description,
  }: {
    url: string;
    title: string;
    description: string;
  } = liveMatchEmbed[0].data;

  switch (button) {
    case "refresh": {
      const matchPoints: string[] = [];
      const mapNameList: string[] = [];
      const groupedMapPointList: string[][] = [];
      let isFinal: boolean;

      await interaction.deferUpdate();

      await interaction.message.edit({
        content: "Refreshing...",
        components: [],
      });

      try {
        const response: any = await axios.get(matchPageUrl);
        const html: string = response.data;
        const $: cheerio.Root = cheerio.load(html);

        const mapPointList: string[] = [];
        const mapUrlList: string[] = [];

        // get match points
        $("div.match-header-vs-score div.js-spoiler span").each((i, el) => {
          matchPoints.push($(el).text().trim());
        });

        // get all map names to mapNameList
        $("div.vm-stats-gamesnav-container div.vm-stats-gamesnav-item").each(
          (i, mapName) => {
            // skip the first element
            if (i === 0) return;

            let map: string = $(mapName).find("div").text().trim();
            map = map.replace(/[0-9\t\n]/g, "");
            mapNameList.push(map);

            const mapUrl: string = vlrUrl + $(mapName).attr("data-href");
            mapUrlList.push(mapUrl);
          }
        );

        // get points from different page
        $("div.score").each((i, el) => {
          mapPointList.push($(el).text().trim());
        });

        isFinal =
          $("div.match-header-vs-note").first().text().trim() === "final";

        for (let i: number = 0; i < mapNameList.length; i++) {
          if (!mapPointList[i * 2] || !mapPointList[i * 2 + 1]) return;

          groupedMapPointList.push([
            mapPointList[i * 2],
            mapPointList[i * 2 + 1],
          ]);
        }
      } catch (error) {
        console.error(error);
      }

      const series: string = description.split("\n")[0];
      const userTag: string = interaction.user.tag;
      const userAvatar: string = interaction.user.displayAvatarURL();

      const liveMatchPointEmbed: EmbedBuilder = new EmbedBuilder()
        .setURL(matchPageUrl)
        .setDescription(
          `${series}\nMatch:\t${matchPoints[0]} - ${matchPoints[2]}`
        )
        .setFooter({
          text: userTag + " refreshed",
          iconURL: userAvatar,
        })
        .setTimestamp();

      if (isFinal) {
        liveMatchPointEmbed.setColor(0x000000);
        liveMatchPointEmbed.setTitle(title.replace("🔴", "Final:\t"));
      } else if (!isFinal) {
        liveMatchPointEmbed.setColor(0xff0000);
        liveMatchPointEmbed.setTitle(title);
      }

      liveMatchEmbedList.push(liveMatchPointEmbed);

      groupedMapPointList.forEach((mapPoints, i) => {
        const mapName: string = mapNameList[i];
        if (mapPoints.includes("0")) return;

        const liveMapPointEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`${mapName}:\t${mapPoints[0]} - ${mapPoints[1]}`);

        const mapPointsSum: number =
          parseInt(mapPoints[0]) + parseInt(mapPoints[1]);
        const mapPointsDiff: number = Math.abs(
          parseInt(mapPoints[0]) - parseInt(mapPoints[1])
        );

        if (isFinal) {
          liveMapPointEmbed.setColor(0x000000);
        } else if (
          (mapPointsSum < 25 &&
            (mapPoints[0] === "13" || mapPoints[1] === "13")) ||
          (mapPointsSum > 25 && mapPointsDiff === 2)
        ) {
          // if map is in overtime and score difference is 2
          liveMapPointEmbed.setColor(0x535c65);
        }

        liveMatchEmbedList.push(liveMapPointEmbed);
      });

      const refreshRow: ActionRowBuilder = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Refresh")
          .setCustomId(`vct-refresh-${interaction.id}`)
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.message.edit({
        content: "",
        embeds: liveMatchEmbedList,
        components: isFinal ? [] : [refreshRow],
        fetchReply: true,
      });

      break;
    }
  }
};
