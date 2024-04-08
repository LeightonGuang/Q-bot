import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";
import axios from "axios";
import { registered } from "../../utils/valorant/registered.js";
import profileUrl from "../../utils/valorant/profileUrl.js";
import { RiotAccount } from "../../types/RiotAccount.js";

export const subCommand = async (interaction) => {
  console.log("LOG: \tlast-game-stats.ts");
  const { channel } = interaction;

  let selectedDiscordId: any = interaction.options.getMember("player");
  let isAllPlayerStats: boolean | null =
    interaction.options.getBoolean("all-players-stats");
  if (selectedDiscordId === null) {
    selectedDiscordId = interaction.user.id;
  } else if (selectedDiscordId) {
    selectedDiscordId = selectedDiscordId.id;
  }

  isAllPlayerStats === null
    ? (isAllPlayerStats = false)
    : interaction.options.getBoolean("all-players-stats");

  if (!registered(interaction, selectedDiscordId)) return;

  let activeRiotAccount: RiotAccount;

  try {
    const { data: userData }: { data: RiotAccount[] } = await axios.get(
      "http://localhost:8080/api/valorant/active/get/" + selectedDiscordId
    );

    if (userData.length === 0) {
      await interaction.reply({
        content: "The selected account does not exist.",
        ephemeral: true,
      });
      return;
    }
    activeRiotAccount = userData[0];
  } catch (error) {
    console.error(error);
  }

  await interaction.reply("Loading info...");

  const trackerProfileUrl: string = profileUrl(activeRiotAccount.riot_id);

  const browser: any = await (puppeteer as any).launch({
    userDataDir: "/home/lg/Documents/github/Q-bot/userData",
    product: "chrome",
    headless: true,
  });

  const page: any = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20100101 Firefox/6.0"
  );
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
  const allPlayerInfo: PlayerObj[] = await page.evaluate(() => {
    const allPlayerStatsElement: any = Array.from(
      document.querySelectorAll(".scoreboard .st-content__item")
    );

    //allPlayerStats is a list full of numbers stats in order
    const allPlayerStats: string[][] = allPlayerStatsElement.map((el: any) => {
      return Array.from(el.querySelectorAll(".value")).map(
        (value: any) => value.textContent
      );
    });

    const stats: string[] = allPlayerStatsElement.map(
      (player: any, playerIndex: number) => ({
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
        acs: allPlayerStats[playerIndex][1],
        kill: allPlayerStats[playerIndex][2],
        death: allPlayerStats[playerIndex][3],
        assist: allPlayerStats[playerIndex][4],
        kd: allPlayerStats[playerIndex][6],
        adr: allPlayerStats[playerIndex][8],
        hs: allPlayerStats[playerIndex][9],
        fb: allPlayerStats[playerIndex][11],
        fd: allPlayerStats[playerIndex][12],
      })
    );
    return stats;
  });

  const teamAEmbedList: EmbedBuilder[] = [];
  const teamBEmbedList: EmbedBuilder[] = [];

  type PlayerObj = {
    riotName: string;
    riotId: string;
    agentIconUrl: string;
    rankIconUrl: string;
    acs: string;
    kill: string;
    death: string;
    assist: string;
    kd: string;
    adr: string;
    hs: string;
    fb: string;
    fd: string;
  };

  for (let i = 0; i < 10; i++) {
    const playerObj: PlayerObj = allPlayerInfo[i];

    const playerEmbed: EmbedBuilder = new EmbedBuilder()
      .setAuthor({
        name: playerObj.riotName + playerObj.riotId,
        iconURL: playerObj.agentIconUrl,
      })
      .setThumbnail(playerObj.rankIconUrl)
      .setDescription(
        "```" +
          `KDA: ${playerObj.kill}/${playerObj.death}/${playerObj.assist}\tACS: ${playerObj.acs}\tHS%: ${playerObj.hs}\tADR: ${playerObj.adr}` +
          "```"
      );

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
    .setTitle(matchInfo[0] + " (tracker.gg)")
    .setURL(trackerProfileUrl)
    .setDescription("```" + `${matchInfo[1]} - ${matchInfo[2]}` + "```");

  interaction.editReply({ content: "", embeds: [MatchInfoEmbed] });

  if (isAllPlayerStats) {
    channel.send({ embeds: teamAEmbedList });
    channel.send({ embeds: teamBEmbedList });
  } else if (!isAllPlayerStats) {
    teamAEmbedList.forEach((embed) => {
      const embedRiotId = embed.data.author.name;

      if (embedRiotId === activeRiotAccount.riot_id) {
        return channel.send({ embeds: teamAEmbedList });
      }
    });

    teamBEmbedList.forEach((embed) => {
      const embedRiotId = embed.data.author.name;

      if (embedRiotId === activeRiotAccount.riot_id) {
        return channel.send({ embeds: teamBEmbedList });
      }
    });
  }
  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  await browser.close();
};
