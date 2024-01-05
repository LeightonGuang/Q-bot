const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const puppeteer = require("puppeteer-extra");

module.exports = async (interaction) => {
  //list that stores the current rank and peak rank embed
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let rankEmbedList = [];

  let { channel } = interaction;

  let userId = interaction.options.getMember("player");
  let isOther = false;
  //if the command is left empty
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
    isOther = true;
  }

  const registered = require("../../utils/valorant/registered");
  const profileUrl = require("../../utils/valorant/profileUrl");

  if (!registered(interaction, userId, isOther)) return;

  let userObj = dataObj.playerList.find((obj) => obj.id === userId);
  let accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  let riotId = accountObj.riotId;
  let trackerProfileUrl = profileUrl(riotId);

  let statEmbedHeader = new EmbedBuilder()
    .setTitle("Riot ID: " + riotId)
    .setURL(trackerProfileUrl);

  rankEmbedList.push(statEmbedHeader);

  await interaction.reply({ content: "Loading info..." });

  function getRankColour(rank) {
    if (rank === "Iron") {
      return 0x3c3c3c;
    } else if (rank === "Bronze") {
      return 0xa5855e;
    } else if (rank === "Silver") {
      return 0xcdd3d1;
    } else if (rank === "Gold") {
      return 0xebca52;
    } else if (rank === "Platinum") {
      return 0x49a6b7;
    } else if (rank === "Diamond") {
      return 0xd681e9;
    } else if (rank === "Ascendant") {
      return 0x58a861;
    } else if (rank === "Immortal") {
      return 0xb13138;
    } else if (rank === "Radiant") {
      return 0xf5f4df;
    } else {
      return 0x000000;
    }
  }

  const browser = await puppeteer.launch({
    //headless: false,
    //args: ['--disable-setuid-sandbox', '--disable-extensions']
  });
  const page = await browser.newPage();
  await page.goto(trackerProfileUrl);

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  const currentRankImgElement = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-icon > img"
  );
  const currentRankNameElement = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-info > div.value"
  );

  let currentRankImgUrl, currentRankName;

  if (!currentRankImgElement) {
    let errorEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("ERROR")
      .setDescription(
        `Please check if your riot id is correct in /player-profile\nor check if your profile is public on [tracker.gg](${trackerProfileUrl})`
      );

    channel.send({ embeds: [errorEmbed] });
    return;
  }

  if (currentRankImgElement) {
    currentRankImgUrl = await page.evaluate(
      (element) => element.src,
      currentRankImgElement
    );
    //console.log("currentRankImgUrl: \t" + currentRankImgUrl);
  }

  if (currentRankNameElement) {
    currentRankName = await page.evaluate(
      (element) => element.textContent,
      currentRankNameElement
    );
    //console.log("currentRankName: \t" + currentRankName);
  }

  let currentRankEmbedColour = currentRankName.trim().split(" ");
  currentRankEmbedColour = currentRankEmbedColour[0];
  //console.log(currentRankEmbedColour);
  currentRankEmbedColour = getRankColour(currentRankEmbedColour);

  let currentRankEmbed = new EmbedBuilder()
    .setColor(currentRankEmbedColour)
    .setAuthor({ name: "Current Rank:" })
    .setTitle(currentRankName)
    .setThumbnail(currentRankImgUrl);

  rankEmbedList.push(currentRankEmbed);
  interaction.editReply({ content: "", embeds: rankEmbedList });
  console.log("LOG: \t" + "sending current rank embed");

  const peakRankImgElement = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div.rating-summary__content.rating-summary__content--secondary > div > div > div > div > div.rating-entry__rank-icon > img"
  );
  const peakRankNameElement = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div.rating-summary__content.rating-summary__content--secondary > div > div > div > div > div.rating-entry__rank-info > div.value"
  );

  let peakRankImgUrl, peakRankName;

  if (peakRankImgElement) {
    peakRankImgUrl = await page.evaluate(
      (element) => element.src,
      peakRankImgElement
    );
  }

  if (peakRankNameElement) {
    peakRankName = await page.evaluate(
      (element) => element.textContent,
      peakRankNameElement
    );
  }

  let peakRankEmbedColour = peakRankName.trim().split(" ");
  peakRankEmbedColour = peakRankEmbedColour[0];
  //console.log(peakRankEmbedColour);
  peakRankEmbedColour = getRankColour(peakRankEmbedColour);

  let peakRankEmbed = new EmbedBuilder()
    .setColor(peakRankEmbedColour)
    .setAuthor({ name: "Peak Rank: " })
    .setTitle(peakRankName)
    .setThumbnail(peakRankImgUrl);

  rankEmbedList.push(peakRankEmbed);
  interaction.editReply({ embeds: rankEmbedList });
  console.log("LOG: \t" + "sending peak rank embed");

  await browser.close();
};
