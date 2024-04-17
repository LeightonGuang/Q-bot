import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";
import { config } from "dotenv";
import dotenv from "dotenv";
dotenv.config({ path: "../../public/.env" });
config();

const MC_SERVER_IP: string = process.env.MC_SERVER_IP;

export const subCommand = async (interaction) => {
  try {
    await interaction.reply({ content: "Loading..." });

    const browser: any = await (puppeteer as any).launch({
      userDataDir: "/home/lg/Documents/github/Q-bot/userData",
      headless: false,
    });
    const page: any = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20100101 Firefox/6.0"
    );
    await page.goto("https://aternos.org/servers");

    // click on the second server
    const serverButton: any =
      "#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers > div > div.list-action > div.servercardlist > div:nth-child(2) > div";
    await page.click(serverButton);

    await page.waitForSelector("span.statuslabel-label", { timeout: 0 });
    const statusElement: any = await page.$("span.statuslabel-label");
    const statusText: string = await statusElement.evaluate(
      (element) => element.textContent.trim(),
      statusElement
    );

    if (statusText === "Online") {
      const alreadyOnlineEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Server is already online!")
        .setDescription(`ip address: ${MC_SERVER_IP}`);

      await interaction.editReply({
        content: "",
        embeds: [alreadyOnlineEmbed],
      });
      await browser.close();
      return;
    } else if (statusText === "Offline") {
      await page.waitForSelector("#start", { timeout: 0 });
      await page.click("#start");

      const loadingEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Server is starting...");
      await interaction.editReply({ content: "", embeds: [loadingEmbed] });

      await page.waitForSelector("div.status.online", { timeout: 0 });

      const onlineEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Server is online!")
        .setDescription("ip address: shrooge8eEO.aternos.me:63070");

      await interaction.editReply({ embeds: [onlineEmbed] });
      await browser.close();
    }
  } catch (error) {
    console.error(error);
  }
};
