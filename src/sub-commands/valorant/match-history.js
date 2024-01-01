const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const puppeteer = require("puppeteer-extra");

module.exports = async (interaction) => {
  let dataFile = fs.readFileSync("data.json");
  let dataObj = JSON.parse(dataFile);
  let resultEmbedList = [];
  let userId = interaction.options.getMember("player");

  const { channel } = interaction;

  //if the command is left empty
  if (userId === null) {
    userId = interaction.user.id;
  } else {
    userId = userId.id;
  }

  const registered = require("../../utils/valorant/registered");
  const profileUrl = require("../../utils/valorant/profileUrl");

  if (!registered(userId)) return;

  let userObj = dataObj.playerList.find((obj) => obj.id === userId);
  let accountObj = userObj.riotAccountList.find((obj) => obj.active === true);
  let riotId = accountObj.riotId;
  let trackerProfileUrl = profileUrl(riotId);

  let embedHeader = new EmbedBuilder()
    .setTitle(riotId)
    .setURL(trackerProfileUrl)
    .setDescription("Past 10 matches history");

  interaction.reply({ embeds: [embedHeader] });

  const matchEmbedMessage = await channel.send({
    content: "Loading info...",
    fetchReply: true,
  });

  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileUrl);
  await page.waitForSelector(".vmr");

  //gets all the info and put them in a list of objects
  const matchResults = await page.evaluate(() => {
    let allMatchResultsList = Array.from(document.querySelectorAll(".vmr"));

    allMatchResultsList = allMatchResultsList.slice(0, 10);

    //
    let winLoseClass = Array.from(document.querySelectorAll(".vmr")).map(
      (element) => element.classList
    );
    let mapPoints = Array.from(document.querySelectorAll(".vmr-score"));
    let groupedSpan = [];

    mapPoints.forEach((div) => {
      const spanElements = div.querySelectorAll("span");
      const spanArray = Array.from(spanElements);

      for (let i = 0; i < spanArray.length; i += 3) {
        const group = spanArray.slice(i, i + 3);
        groupedSpan.push(group);
      }
    });
    //Array.from() turn all the argument to an array
    const kda = Array.from(document.querySelectorAll(".vmr-stats"))
      .flatMap((stats) =>
        Array.from(stats.querySelectorAll(".trn-match-row__text-value"))
      )
      .map((element) => element.textContent);

    const allMatchInfo = allMatchResultsList.map((container, counter) => ({
      agenticonUrl: container
        .querySelector(".vmr .vmr-info-left .vmr-agent img")
        .getAttribute("src"),
      mapName: container
        .querySelector(".vmr .vmr-info-left .trn-match-row__text-value")
        .textContent.trim(),
      winLoss: winLoseClass[counter][2],
      mapPoints: groupedSpan,
      kda: kda[counter * 6].trim(),
    }));
    return allMatchInfo;
  });

  console.log(JSON.stringify(matchResults));

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

  let matchEmbedList = [];

  for (let i = 0; i < matchResults.length; i++) {
    let match = matchResults[i];
    matchEmbed = new EmbedBuilder()
      .setAuthor({
        name: match.winLoss.split("-")[5].toUpperCase(),
        iconURL: match.agenticonUrl,
      })
      .addFields(
        { name: "Game Point:", value: match.groupedSpan, inline: true },
        { name: "Map:", value: match.mapName, inline: true },
        { name: "KDA:", value: match.kda, inline: true }
      );

    if (match.winLoss.split("-")[5] === "win") {
      matchEmbed.setColor(0x74da97);
    } else if (match.winLoss.split("-")[5] === "loss") {
      matchEmbed.setColor(0xc04761);
    }

    matchEmbedList.push(matchEmbed);
    matchEmbedMessage.edit({ content: "", embeds: matchEmbedList });
  }

  console.log("LOG:\t" + "match history embed sent");

  await browser.close();
};
