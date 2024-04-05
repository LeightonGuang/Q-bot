import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";
import axios from "axios";
import { registered } from "../../utils/valorant/registered.js";
import profileUrl from "../../utils/valorant/profileUrl.js";
import { RiotAccount } from "../../types/RiotAccount.js";

export const subCommand: any = async (interaction) => {
  const chosenMap: string = interaction.options.getString("map");
  let selectedDiscordId: string = interaction.options.getMember("player");

  //if the command is left empty
  if (selectedDiscordId === null) {
    selectedDiscordId = interaction.user.id;
  }

  if (!registered(interaction, selectedDiscordId)) return;

  let activeRiotAccount: RiotAccount;

  try {
    const { data: userData }: { data: RiotAccount[] } = await axios.get(
      "http://localhost:8080/api/valorant/active/get/" + selectedDiscordId
    );

    activeRiotAccount = userData[0];
  } catch (error) {
    console.error(error);
  }

  const trackerProfileMapsUrl: string =
    profileUrl(activeRiotAccount.riot_id) + "/maps";

  const embedList: EmbedBuilder[] = [];

  // const embedHeader: EmbedBuilder = new EmbedBuilder()
  //   .setTitle(activeRiotAccount.riot_id)
  //   .setURL(trackerProfileMapsUrl)
  //   .setDescription("Map Win %");

  // embedList.push(embedHeader);

  await interaction.reply({
    embeds: embedList,
    content: "Loading info...",
    fetchReply: true,
  });

  const browser: any = await (puppeteer as any).launch({ headless: true });
  const page: any = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20100101 Firefox/6.0"
  );
  await page.goto(trackerProfileMapsUrl);

  try {
    const mapStats: any = await page.evaluate(() => {
      const allMaps: any = document.querySelectorAll(".st-content__item");
      const allBackgroundImg: any = document.querySelectorAll(
        ".st-content__item .st__item.st-content__item-value.st__item--sticky"
      );

      const allBackgroundImgArray: string[] = [];

      for (let i = 0; i < allBackgroundImg.length; i++) {
        const style: string = allBackgroundImg[i].getAttribute("style");
        const regex: RegExp = /url\(['"](.+?)['"]\)/;

        const imgUrl: string = style.match(regex)[1];
        allBackgroundImgArray.push(imgUrl);
      }

      const mapStatsList: any[] = [];

      allMaps.forEach((map, index) => {
        const allStats: any = map.querySelectorAll(".info .value");

        const mapStats: any = {
          mapName: allStats[0].textContent,
          winPercentage: allStats[1].textContent,
          wins: allStats[2].textContent,
          losses: allStats[3].textContent,
          kd: allStats[4].textContent,
          adr: allStats[5].textContent,
          acs: allStats[6].textContent,
          mapImg: allBackgroundImgArray[index],
        };

        mapStatsList.push(mapStats);
      });

      return mapStatsList;
    });

    if (!chosenMap) {
      mapStats.forEach((map) => {
        const mapEmbed: EmbedBuilder = new EmbedBuilder()
          .setAuthor({
            name: map.mapName,
          })
          .addFields(
            {
              name: "Win %",
              value: map.winPercentage,
              inline: true,
            },
            {
              name: "Wins",
              value: map.wins,
              inline: true,
            },
            {
              name: "Losses",
              value: map.losses,
              inline: true,
            },
            {
              name: "K/D",
              value: map.kd,
              inline: true,
            },
            {
              name: "ADR",
              value: map.adr,
              inline: true,
            },
            {
              name: "ACS",
              value: map.acs,
              inline: true,
            }
          )
          .setThumbnail(map.mapImg);

        embedList.push(mapEmbed);
        interaction.editReply({
          content: "",
          embeds: embedList,
        });
      });
    } else if (chosenMap) {
      const map: any = mapStats.find(
        (map) => map.mapName.toLowerCase() === chosenMap
      );

      if (!map) {
        const errorEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle(`You have not played a game in ${chosenMap} yet`);

        return interaction.editReply({
          content: "",
          embeds: [errorEmbed],
        });
      }
      const mapEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(activeRiotAccount.riot_id + " (tracker.gg)")
        .setURL(trackerProfileMapsUrl)
        .setAuthor({
          name: map.mapName,
        })
        .setDescription(
          "```" +
            `Win%: ${map.winPercentage}\tWins: ${map.wins}\tLosses: ${map.losses}\t` +
            "```" +
            "```" +
            `K/D: ${map.kd}\tADR: ${map.adr}\tACS: ${map.acs}` +
            "```"
        )
        // .addFields(
        //   {
        //     name: "Win %",
        //     value: map.winPercentage,
        //     inline: true,
        //   },
        //   {
        //     name: "Wins",
        //     value: map.wins,
        //     inline: true,
        //   },
        //   {
        //     name: "Losses",
        //     value: map.losses,
        //     inline: true,
        //   },
        //   {
        //     name: "K/D",
        //     value: map.kd,
        //     inline: true,
        //   },
        //   {
        //     name: "ADR",
        //     value: map.adr,
        //     inline: true,
        //   },
        //   {
        //     name: "ACS",
        //     value: map.acs,
        //     inline: true,
        //   }
        // )
        .setImage(map.mapImg);

      embedList.push(mapEmbed);
      interaction.editReply({
        content: "",
        embeds: embedList,
      });
    }
  } catch (error) {
    console.error(error);
  }

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  await browser.close();
};
