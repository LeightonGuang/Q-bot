import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";

export const subCommand = async (interaction) => {
  try {
    await interaction.reply({ content: "Loading..." });

    const browser: any = await (puppeteer as any).launch({
      userDataDir: "/home/lg/Documents/github/Q-bot/userData",
      headless: true,
    });
    const page: any = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20100101 Firefox/6.0"
    );
    await page.goto("https://aternos.org/servers");

    const serverButton: string =
      "#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div:nth-child(2) > div";
    // click on the second server
    await page.click(serverButton);

    await page.waitForSelector("span.statuslabel-label", { timeout: 0 });
    const statusElement: any = await page.$("span.statuslabel-label");
    const statusText: string = await statusElement.evaluate(
      (element) => element.textContent.trim(),
      statusElement
    );

    if (statusText === "Offline") {
      const offlineEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x222222)
        .setDescription("Server is offline and no players are online.");
      await interaction.editReply({ content: "", embeds: [offlineEmbed] });

      await browser.close();
      return;
    } else if (statusText === "Online") {
      const playersButton: string = `a[href*="/players/"]`;
      await page.waitForSelector(playersButton, { timeout: 0 });

      // click on players button
      await page.click(playersButton);

      const onlinePlayerCard: string = "div.playercardlist.online a.playercard";

      await page.waitForSelector(onlinePlayerCard, { timeout: 0 });

      const playerElements: any = await page.$$(onlinePlayerCard);
      const embedList: EmbedBuilder[] = [];

      for (const playerElement of playerElements) {
        const nameElement: any = await playerElement.$("div.player-name");
        const nameText: string = await nameElement.evaluate((element) =>
          element.getAttribute("title")
        );

        // const imageElement: any = await playerElement.$(
        //   "div.player-avatar > img"
        // );
        // const imgSrc: string = await imageElement.evaluate((element) =>
        //   element.getAttribute("src")
        // );

        const playerEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor(0x1fd78d)
          .setAuthor({
            name: nameText,
            // iconURL: imgSrc,
          });

        embedList.push(playerEmbed);
      }
      await browser.close();
      await interaction.editReply({ content: "", embeds: embedList });
    }
  } catch (error) {
    console.error(error);
  }
};
