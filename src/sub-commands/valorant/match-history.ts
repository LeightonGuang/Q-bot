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

  const { channel } = interaction;

  //if the command is left empty
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  if (!registered(interaction, userId)) return;

  const userObj = dataObj.playerList.find((obj) => obj.id === userId);
  const accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  const riotId = accountObj.riotId;
  const trackerProfileUrl = profileUrl(riotId);

  const embedHeader = new EmbedBuilder()
    .setTitle(riotId)
    .setURL(trackerProfileUrl)
    .setDescription("Past 10 matches history");

  interaction.reply({ embeds: [embedHeader] });

  const matchEmbedMessage = await channel.send({
    content: "Loading info...",
    fetchReply: true,
  });

  const browser = await (puppeteer as any).launch({ headless: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileUrl);
  await page.waitForSelector(".vmr");

  //gets all the info and put them in a list of objects
  const matchResults = await page.evaluate(() => {
    let allMatchResultsList = Array.from(document.querySelectorAll(".vmr"));

    // get the first 10 matches
    allMatchResultsList = allMatchResultsList.slice(0, 10);

    const winLoseClass = Array.from(document.querySelectorAll(".vmr")).map(
      (element) => element.classList
    );

    // get all the map points
    const mapPointDivs = document.querySelectorAll(".vmr-score");
    const allMapPointsArr = [];

    mapPointDivs.forEach((div) => {
      const spans = div.querySelectorAll("span");
      const mapPoint = `${spans[0].textContent} ${spans[1].textContent} ${spans[2].textContent}`;
      allMapPointsArr.push(mapPoint);
    });

    // get all the kda
    // Array.from() turn all the argument to an array
    const kda = Array.from(document.querySelectorAll(".vmr-stats"))
      .flatMap((stats) =>
        Array.from(stats.querySelectorAll(".trn-match-row__text-value"))
      )
      .map((element) => element.textContent);

    const allMatchInfo = allMatchResultsList.map((container, index) => ({
      agenticonUrl: container
        .querySelector(".vmr .vmr-info-left .vmr-agent img")
        .getAttribute("src"),
      mapName: container
        .querySelector(".vmr .vmr-info-left .trn-match-row__text-value")
        .textContent.trim(),
      winLoss: winLoseClass[index][2],
      mapPoints: allMapPointsArr[index],
      kda: kda[index * 6].trim(),
    }));
    return allMatchInfo;
  });

  // console.log(JSON.stringify(matchResults));

  let winCounter = 0;
  let lossCounter = 0;

  for (let match of matchResults) {
    if (match.winLoss === "trn-match-row--outcome-win") {
      winCounter++;
    } else if (match.winLoss === "trn-match-row--outcome-loss") {
      lossCounter++;
    }
  }

  embedHeader.addFields(
    { name: "Wins:", value: winCounter.toString(), inline: true },
    { name: "\u200B", value: "-", inline: true },
    { name: "Losses:", value: lossCounter.toString(), inline: true }
  );

  interaction.editReply({ embeds: [embedHeader] });

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  const matchEmbedList = [];
  console.log("Match Results: " + JSON.stringify(matchResults[0]));

  matchResults.forEach((match) => {
    const matchEmbed = new EmbedBuilder()
      .setAuthor({
        name: match.winLoss.split("-")[5].toUpperCase(),
        iconURL: match.agenticonUrl,
      })
      .addFields(
        {
          name: "Game Point:",
          value: match.mapPoints,
          inline: true,
        },
        {
          name: "Map:",
          value: match.mapName,
          inline: true,
        },
        { name: "KDA:", value: match.kda, inline: true }
      );

    if (match.winLoss.split("-")[5] === "win") {
      matchEmbed.setColor(0x74da97);
    } else if (match.winLoss.split("-")[5] === "loss") {
      matchEmbed.setColor(0xc04761);
    }

    matchEmbedList.push(matchEmbed);
    matchEmbedMessage.edit({ content: "", embeds: matchEmbedList });
  });

  console.log("LOG:\t" + "match history embed sent");

  await browser.close();
};
