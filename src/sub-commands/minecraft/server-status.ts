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

    const serverButton: any =
      "#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div:nth-child(2) > div";
    await page.click(serverButton);

    await page.waitForSelector("span.statuslabel-label", { timeout: 0 });
    const statusElement: any = await page.$("span.statuslabel-label");
    const statusText: string = await statusElement.evaluate(
      (element) => element.textContent.trim(),
      statusElement
    );

    // console.log("statusText: " + statusText);

    if (statusText === "Online") {
      const onlineEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Server is online!");

      await interaction.editReply({ content: "", embeds: [onlineEmbed] });
      await browser.close();
      return;
    } else if (statusText === "Offline") {
      const offlineEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Server is offline");

      await interaction.editReply({ content: "", embeds: [offlineEmbed] });
      await browser.close();
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
