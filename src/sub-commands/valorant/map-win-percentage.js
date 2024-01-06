const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const puppeteer = require("puppeteer-extra");

module.exports = async (interaction) => {
  const dataFile = fs.readFileSync("data.json");
  const dataObj = JSON.parse(dataFile);

  let userId = interaction.options.getMember("player");

  //if the command is left empty
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  const registered = require("../../utils/valorant/registered");
  const profileUrl = require("../../utils/valorant/profileUrl");

  if (!registered(interaction, userId)) return;

  const userObj = dataObj.playerList.find((obj) => obj.id === userId);
  const accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  const riotId = accountObj.riotId;
  const trackerProfileMapsUrl = profileUrl(riotId) + "/maps";

  const embedList = [];

  const embedHeader = new EmbedBuilder()
    .setTitle(riotId)
    .setURL(trackerProfileMapsUrl)
    .setDescription("Map Win Percentage");

  embedList.push(embedHeader);

  await interaction.reply({
    embeds: embedList,
    content: "Loading info...",
    fetchReply: true,
  });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileMapsUrl);

  const mapStats = await page.evaluate(() => {
    const allMaps = document.querySelectorAll(".st-content__item");
    const allBackgroundImg = document.querySelectorAll("--background-image");

    const mapStatsList = [];

    allMaps.forEach((map) => {
      const allStats = map.querySelectorAll(".info .value");

      const mapStats = {
        mapName: allStats[0].textContent,
        winPercentage: allStats[1].textContent,
        wins: allStats[2].textContent,
        losses: allStats[3].textContent,
        kd: allStats[4].textContent,
        adr: allStats[5].textContent,
        acs: allStats[6].textContent,
      };

      mapStatsList.push(mapStats);
    });

    return mapStatsList;
  });

  mapStats.forEach((map) => {
    const mapEmbed = new EmbedBuilder()
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
      );

    embedList.push(mapEmbed);
    interaction.editReply({
      content: "",
      embeds: embedList,
    });
  });

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  await browser.close();
};
