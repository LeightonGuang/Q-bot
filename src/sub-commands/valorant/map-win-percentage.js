const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const puppeteer = require("puppeteer-extra");

module.exports = async (interaction) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);

  let userId = interaction.options.getMember("player");

  //if the command is left empty
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  const registered = require("../../utils/valorant/registered");
  let profileUrl = require("../../utils/valorant/profileUrl");

  let userObj = dataObj.playerList.find((obj) => obj.id === userId);
  let accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  let riotId = accountObj.riotId;
  let trackerProfileMapsUrl = profileUrl(riotId) + "/maps";

  if (!registered(userId)) return;

  interaction.reply({ content: "Loading info..." });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileMapsUrl);

  const mapWin = await page.evaluate(() => {
    const allMaps = Array.from(document.querySelectorAll(".st-content__item"));

    const allMapsList = Array.from(
      document.querySelectorAll(".st-content__item")
    )
      .flatMap((stat) => Array.from(stat.querySelectorAll(".info .value")))
      .map((element) => element.textContent);

    const mapStats = allMaps.map((map) => ({
      mapName: allMapsList[map * 15],
      winPct: allMapsList[map * 15 + 1],
      /**win: map,
      loss: map,
      KD: map,
      attackWinPct: map,
      defenseWinPct: map,
      **/
    }));

    return mapStats;
  });

  console.log(mapWin);

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  await browser.close();
};
