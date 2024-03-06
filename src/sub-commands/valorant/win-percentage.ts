import { EmbedBuilder } from "discord.js";
import fs from "fs";
import puppeteer from "puppeteer-extra";
import path from "path";
import { fileURLToPath } from "url";
import { registered } from "../../utils/valorant/registered.js";
import { profileUrl } from "../../utils/valorant/profileUrl.js";

export const subCommand = async (interaction) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const dataFilePath = path.resolve(
    path.dirname(currentFilePath),
    "../../../public/data.json"
  );

  const dataFile = fs.readFileSync(dataFilePath, "utf-8");
  const dataObj = JSON.parse(dataFile);

  let userId = interaction.options.getMember("player");

  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  if (!registered(interaction, dataObj.playerList, userId)) return;

  await interaction.reply("Loading info...");

  const userObj = dataObj.playerList.find((obj) => obj.id === userId);
  const accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  const riotId = accountObj.riotId;
  const trackerProfileUrl = profileUrl(riotId);

  const browser = await (puppeteer as any).launch({ headless: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileUrl);

  const playerIconSelector =
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.ph > div.ph__container > div.user-avatar.user-avatar--large.ph-avatar > img.user-avatar__image";
  const winSelector =
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-main > div.area-main-stats > div.segment-stats.card.bordered.header-bordered.responsive > div.highlighted.highlighted--giants > div.highlighted__content > div > div.trn-profile-highlighted-content__stats > div > div.trn-profile-highlighted-content__ratio > svg > g:nth-child(3) > text:nth-child(1)";
  const loseSelector =
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-main > div.area-main-stats > div.segment-stats.card.bordered.header-bordered.responsive > div.highlighted.highlighted--giants > div.highlighted__content > div > div.trn-profile-highlighted-content__stats > div > div.trn-profile-highlighted-content__ratio > svg > g:nth-child(3) > text:nth-child(2)";

  //get the player icon url
  const playerIconUrl = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return element ? element.src : null;
  }, playerIconSelector);

  //get the win number
  const winNumString = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return element ? element.textContent : null;
  }, winSelector);

  //get the lost number
  const loseNumString = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return element ? element.textContent : null;
  }, loseSelector);

  const winNum: number = parseInt(winNumString);
  const loseNum: number = parseInt(loseNumString);

  let winPercentage: any = (winNum / (winNum + loseNum)) * 100;
  winPercentage = winPercentage.toFixed(1);

  const winPercentageEmbed = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle(riotId)
    .setURL(trackerProfileUrl)
    .setThumbnail(playerIconUrl)
    .setDescription(`Win Percentage: ${winPercentage}%`)
    .addFields([
      { name: "Wins: ", value: winNumString, inline: true },
      { name: "Loses: ", value: loseNumString, inline: true },
      {
        name: "Games: ",
        value: (winNum + loseNum).toString(),
        inline: true,
      },
    ]);

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  await browser.close();

  await interaction.editReply({
    content: "",
    embeds: [winPercentageEmbed],
  });
  console.log("Win Percentage Embed");
};
