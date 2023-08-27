const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const writeToFile = require("../utils/writeToFile");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valorant")
    .setDescription("Commands for Valorant related stuff")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ongoing-events")
        .setDescription("Ongoing Valorant Champions Tour events.")
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("upcoming-events")
        .setDescription("Upcoming Valorant Champions Tour events.")
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("check-rank")
        .setDescription("Check player's current rank and peak rank")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("win-percentage")
        .setDescription("Check player's current act rank win percentage")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("last-game-stats")
        .setDescription("Check player's last game stats")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription("default(empty) will be yourself")
        )
    ),

  async execute(interaction) {
    console.log("FILE:\t" + "valorant.js");
    async function fetchEvents(eventList) {}

    async function fetchEventMatch(eventList) {}

    async function sendEmbed(eventList) {}

    function profileUrl(riotId) {
      //gets the tracker.gg profile url using their riot id
      let modifiedId = riotId.replace(/\s+/g, "%20");
      modifiedId = modifiedId.replace(/#/g, "%23");

      //console.log(modifiedId);

      let playerUrl =
        "https://tracker.gg/valorant/profile/riot/" + modifiedId + "/overview";
      //console.log(playerUrl);
      return playerUrl;
    }

    function registered(userId) {
      const playerRegistered = dataObj.playerList.find(
        (obj) => obj.id === userId
      );

      if (playerRegistered) {
        return true;
      } else if (!playerRegistered) {
        interaction.reply({
          content:
            "Please use the command ***/account add-riot-account*** to add a riot account",
          ephemeral: true,
        });
        return false;
      }
    }

    const { channel } = interaction;

    let vlr_url = "https://vlr.gg";

    let subCommand = interaction.options.getSubcommand();
    let valorantEventEmbedList = [];

    let upcomingEventList = [];

    if (subCommand === "ongoing-events") {
      const ongoingEvents = require("../sub-commands/valorant/ongoing-events");
      ongoingEvents(interaction);
    } else if (subCommand === "upcoming-events") {
      let upcomingEventEmbedHeader = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle("Upcoming Valorant Champions Tour " + year)
        .setURL(vlr_url + "/vct-" + year)
        .setDescription(
          "Riot's official " + year + " Valorant tournament circuit"
        );

      valorantEventEmbedList.push(upcomingEventEmbedHeader);

      await interaction.reply({
        embeds: valorantEventEmbedList,
        fetchReply: true,
      });

      await fetchEvents(upcomingEventList);
      await fetchEventMatch(upcomingEventList);
      await sendEmbed(upcomingEventList);
    } else if (subCommand === "check-rank") {
      let checkRank = require("../sub-commands/valorant/check-rank");
      checkRank(interaction, dataObj);
    } else if (subCommand === "win-percentage") {
      let winPercentage = require("../sub-commands/valorant/win-percentage");
      winPercentage(interaction, dataObj);
    } else if (subCommand === "last-game-stats") {
      let userId = interaction.options.getMember("player");

      if (userId === null) {
        userId = interaction.user.id;
      } else {
        userId = userId.id;
      }

      if (!registered(userId)) return;

      await interaction.reply("Loading info...");

      let userObj = dataObj.playerList.find((obj) => obj.id === userId);
      let accountObj = userObj.riotAccountList.find(
        (obj) => obj.active === true
      );
      let riotId = accountObj.riotId;
      let trackerProfileUrl = profileUrl(riotId);

      const browser = await puppeteer.launch({ headless: true });

      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(trackerProfileUrl);
      await page.waitForSelector(".vmr");
      //first game on the list
      const lastGameSelector =
        "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-main > div.area-matches.flex.flex-col.gap-4 > div.matches > div.trn-gamereport-list.trn-gamereport-list--compact > div:nth-child(1) > div.trn-gamereport-list__group-entries > div:nth-child(1)";

      await page.click(lastGameSelector);

      await page.waitForSelector(
        ".st-content__item .trn-ign .trn-ign__username"
      );

      const matchInfo = await page.evaluate(() => {
        const mapName = document.querySelector(
          ".vm-header-info > div.trn-match-drawer__header-block > div.trn-match-drawer__header-value"
        ).textContent;
        const gamePoints = Array.from(
          document.querySelectorAll(".team .value")
        ).map((el) => el.textContent);

        return [mapName, gamePoints[0], gamePoints[1]];
      });
      //console.log(matchInfo);

      //allPlayerInfo is a list of object with player stats
      const allPlayerInfo = await page.evaluate(() => {
        const allPlayerStats = Array.from(
          document.querySelectorAll(".scoreboard .st-content__item")
        )
          .flatMap((item) => Array.from(item.querySelectorAll(".value")))
          .map((element) => element.textContent);
        const playerInfo = Array.from(
          document.querySelectorAll(".vm-table .st-content__item")
        );

        const stats = playerInfo.map((player, playerNum) => ({
          riotName: player
            .querySelector(".st-content__item .trn-ign .trn-ign__username")
            .textContent.trim(),
          riotId: player
            .querySelector(".st-content__item .trn-ign .trn-ign__discriminator")
            .textContent.trim(),
          agentIconUrl: player
            .querySelector(
              ".scoreboard .st-content__item .st-custom-name .image img"
            )
            .getAttribute("src"),
          rank: player.querySelector(
            ".scoreboard .st-content__item .info .rank span"
          ).textContent,
          rankIconUrl: player
            .querySelector(
              ".scoreboard .st-content__item .st__item--align-center .image img"
            )
            .getAttribute("src"),
          acs: allPlayerStats[playerNum * 14 + 1],
          kill: allPlayerStats[playerNum * 14 + 2],
          death: allPlayerStats[playerNum * 14 + 3],
          assist: allPlayerStats[playerNum * 14 + 4],
          kd: allPlayerStats[playerNum * 14 + 6],
          adr: allPlayerStats[playerNum * 14 + 8],
          hs: allPlayerStats[playerNum * 14 + 9],
          fb: allPlayerStats[playerNum * 14 + 11],
          fd: allPlayerStats[playerNum * 14 + 12],
        }));
        return stats;
      });

      //console.log(allPlayerInfo);

      let teamAEmbedList = [];
      // add team A embed
      teamAEmbed = new EmbedBuilder()
        .setColor(0x49c6b8)
        .setTitle("Team A")
        .setDescription(`Map Points: ${matchInfo[1]}`);

      teamAEmbedList.push(teamAEmbed);

      let teamBEmbedList = [];
      // add team B embed
      teamBEmbed = new EmbedBuilder()
        .setColor(0xb95564)
        .setTitle("Team B")
        .setDescription(`Map Points: ${matchInfo[2]}`);

      teamBEmbedList.push(teamBEmbed);

      for (let i = 0; i < 10; i++) {
        let playerObj = allPlayerInfo[i];

        let playerEmbed = new EmbedBuilder()
          .setAuthor({
            name: playerObj.riotName + playerObj.riotId,
            iconURL: playerObj.agentIconUrl,
          })
          .setThumbnail(playerObj.rankIconUrl)
          .addFields([
            { name: "Kills: ", value: playerObj.kill, inline: true },
            { name: "Deaths:", value: playerObj.death, inline: true },
            { name: "Assists:", value: playerObj.assist, inline: true },
            { name: "ACS:    ", value: playerObj.acs, inline: true },
            { name: "K/D:", value: playerObj.kd, inline: true },
            { name: "Headshot%:", value: playerObj.hs, inline: true },
            { name: "ADR: ", value: playerObj.adr, inline: true },
            { name: "First Blood:", value: playerObj.fb, inline: true },
            { name: "First Death:", value: playerObj.fd, inline: true },
          ]);

        if (i < 5) {
          playerEmbed.setColor(0x49c6b8);
          teamAEmbedList.push(playerEmbed);
        } else if (i > 4) {
          playerEmbed.setColor(0xb95564);
          teamBEmbedList.push(playerEmbed);
        }
      }

      let MatchInfoEmbed = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle(matchInfo[0])
        .setURL(trackerProfileUrl)
        .addFields([
          { name: "Team A", value: matchInfo[1], inline: true },
          { name: "\u200B", value: `-`, inline: true },
          { name: "Team B", value: matchInfo[2], inline: true },
        ]);

      interaction.editReply({ content: "", embeds: [MatchInfoEmbed] });

      channel.send({ embeds: teamAEmbedList });
      channel.send({ embeds: teamBEmbedList });

      await page.screenshot({ path: "screenshot.png", fullPage: true });
      console.log("LOG: \t" + "screenshot");

      await browser.close();
    }
  },
};
