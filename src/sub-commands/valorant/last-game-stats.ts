import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";
import axios from "axios";
import { registered } from "../../utils/valorant/registered.js";
import { profileUrl } from "../../utils/valorant/profileUrl.js";
import { RiotAccount } from "../../types/RiotAccount.js";

export const subCommand = async (interaction) => {
  const { channel } = interaction;

  let selectedDiscordId: any = interaction.options.getMember("player");

  if (selectedDiscordId === null) {
    selectedDiscordId = interaction.user.id;
  } else {
    selectedDiscordId = selectedDiscordId.id;
  }

  if (!registered(interaction, selectedDiscordId)) return;

  let riotId: string;

  try {
    const { data: userData }: { data: RiotAccount[] } = await axios.get(
      "http://localhost:8080/api/valorant/active/get/" + selectedDiscordId
    );

    if (userData.length === 0) {
      interaction.reply({
        content: "The selected account does not exist.",
        ephemeral: true,
      });
      return;
    }
    const activeRiotAccount: RiotAccount = userData[0];
    riotId = activeRiotAccount.riot_id;
  } catch (error) {
    console.error(error);
  }

  await interaction.reply("Loading info...");

  const trackerProfileUrl: string = profileUrl(riotId);

  const browser: any = await (puppeteer as any).launch({
    userDataDir: "./user_data",
    product: "chrome",
    headless: false,
  });

  const page: any = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(trackerProfileUrl);
  await page.waitForSelector(".vmr");
  //first game on the list
  const lastGameSelector =
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-main > div.area-matches.flex.flex-col.gap-4 > div.matches > div.trn-gamereport-list.trn-gamereport-list--compact > div:nth-child(1) > div.trn-gamereport-list__group-entries > div:nth-child(1)";

  await page.click(lastGameSelector);

  await page.waitForSelector(".st-content__item .trn-ign .trn-ign__username");

  const matchInfo: any = await page.evaluate(() => {
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
  const allPlayerInfo: any = await page.evaluate(() => {
    //playerInfo is list of players' stats container
    const playerInfo: any = Array.from(
      document.querySelectorAll(".vm-table .st-content__item")
    );

    //allPlayerStats is a list full of numbers stats in order
    const allPlayerStats: any = Array.from(
      document.querySelectorAll(".scoreboard .st-content__item")
    )
      .flatMap((item) => Array.from(item.querySelectorAll(".value")))
      .map((element) => element.textContent);

    const stats: string[] = playerInfo.map((player, playerNum) => ({
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

  const teamAEmbedList: EmbedBuilder[] = [];
  // add team A embed
  const teamAEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0x49c6b8)
    .setTitle("Team A")
    .setDescription(`Map Points: ${matchInfo[1]}`);

  teamAEmbedList.push(teamAEmbed);

  const teamBEmbedList: EmbedBuilder[] = [];
  // add team B embed
  const teamBEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xb95564)
    .setTitle("Team B")
    .setDescription(`Map Points: ${matchInfo[2]}`);

  teamBEmbedList.push(teamBEmbed);

  for (let i = 0; i < 10; i++) {
    const playerObj: any = allPlayerInfo[i];

    const playerEmbed: EmbedBuilder = new EmbedBuilder()
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

  const MatchInfoEmbed: EmbedBuilder = new EmbedBuilder()
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
};
