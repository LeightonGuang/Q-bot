import { EmbedBuilder } from "discord.js";
import fs from "node:fs";
import puppeteer from "puppeteer-extra";
import path from "path";
import { fileURLToPath } from "url";
import { registered } from "../../utils/registered.js";
import { profileUrl } from "../../utils/profileUrl.js";

export const subCommand = async (interaction) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );

  const dataFile = fs.readFileSync(dataFilePath, "utf-8");
  const dataObj = JSON.parse(dataFile);
  const rankEmbedList = [];

  const { channel } = interaction;

  let userId = interaction.options.getMember("player");

  //if the command is for the user's self
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  if (!registered(interaction, dataObj.playerList, userId)) return;

  const userObj = dataObj.playerList.find((obj) => obj.id === userId);
  const accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  const riotId = accountObj.riotId;
  const trackerProfileUrl = profileUrl(riotId);

  const statEmbedHeader = new EmbedBuilder()
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

  const browser = await (puppeteer as any).launch({
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
  }

  if (currentRankNameElement) {
    currentRankName = await page.evaluate(
      (element) => element.textContent,
      currentRankNameElement
    );
  }

  let currentRankEmbedColour = currentRankName.trim().split(" ");
  currentRankEmbedColour = currentRankEmbedColour[0];
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
