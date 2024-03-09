import { EmbedBuilder } from "discord.js";
import puppeteer from "puppeteer-extra";
import axios from "axios";
import { registered } from "../../utils/valorant/registered.js";
import { profileUrl } from "../../utils/valorant/profileUrl.js";
import { RiotAccount } from "../../types/RiotAccount.js";

export const subCommand = async (interaction) => {
  const rankEmbedList: EmbedBuilder[] = [];

  const { channel }: { channel: any } = interaction;

  let selectedDiscordId: string = interaction.options.getMember("player");

  //if the command is for the user's self
  if (selectedDiscordId === null) {
    selectedDiscordId = interaction.user.id;
  }

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

  const trackerProfileUrl: string = profileUrl(activeRiotAccount.riot_id);

  await interaction.reply({ content: "Loading info..." });

  const browser: any = await (puppeteer as any).launch({
    //headless: false,
    //args: ['--disable-setuid-sandbox', '--disable-extensions']
  });
  const page: any = await browser.newPage();
  await page.goto(trackerProfileUrl);

  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("LOG: \t" + "screenshot");

  const currentRankImgElement: any = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-icon > img"
  );
  const currentRankNameElement: any = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div > div > div > div > div > div.rating-entry__rank-info > div.value"
  );
  const userAvatarImgElement: any = await page.$("img.user-avatar__image");

  let currentRankImgUrl, currentRankName, userAvatarImgUrl;

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

  if (currentRankName) {
    userAvatarImgUrl = await page.evaluate(
      (element) => element.src,
      userAvatarImgElement
    );
  }
  const statEmbedHeader: EmbedBuilder = new EmbedBuilder()
    .setAuthor({
      name: activeRiotAccount.riot_id,
      iconURL: userAvatarImgUrl,
    })
    .setTitle("tracker.gg")
    .setURL(trackerProfileUrl);

  rankEmbedList.push(statEmbedHeader);

  function getRankColour(rank: string) {
    switch (rank) {
      case "Iron":
        return 0x3c3c3c;
      case "Bronze":
        return 0xa5855e;
      case "Silver":
        return 0xcdd3d1;
      case "Gold":
        return 0xebca52;
      case "Platinum":
        return 0x49a6b7;
      case "Diamond":
        return 0xd681e9;
      case "Ascendant":
        return 0x58a861;
      case "Immortal":
        return 0xb13138;
      case "Radiant":
        return 0xf5f4df;
      default:
        return 0x000000;
    }
  }

  let currentRankEmbedColour = currentRankName.trim().split(" ");
  currentRankEmbedColour = currentRankEmbedColour[0];
  currentRankEmbedColour = getRankColour(currentRankEmbedColour);

  const currentRankEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(currentRankEmbedColour)
    .setAuthor({ name: "Current Rank:" })
    .setTitle(currentRankName)
    .setThumbnail(currentRankImgUrl);

  rankEmbedList.push(currentRankEmbed);
  await interaction.editReply({ content: "", embeds: rankEmbedList });
  console.log("LOG: \t" + "sending current rank embed");

  const peakRankImgElement: any = await page.$(
    "#app > div.trn-wrapper > div.trn-container > div > main > div.content.no-card-margin > div.site-container.trn-grid.trn-grid--vertical.trn-grid--small > div.trn-grid.container > div.area-sidebar > div.rating-summary.trn-card.trn-card--bordered.area-rating.has-primary > div.rating-summary__content.rating-summary__content--secondary > div > div > div > div > div.rating-entry__rank-icon > img"
  );
  const peakRankNameElement: any = await page.$(
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

  const peakRankEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(peakRankEmbedColour)
    .setAuthor({ name: "Peak Rank: " })
    .setTitle(peakRankName)
    .setThumbnail(peakRankImgUrl);

  rankEmbedList.push(peakRankEmbed);
  await interaction.editReply({ embeds: rankEmbedList });
  console.log("LOG: \t" + "sending peak rank embed");

  function convertedRank(rank: string) {
    let [rankName, tier]: string[] = rank.split(" ");

    switch (rankName) {
      case "Iron":
        return "I" + tier;
      case "Bronze":
        return "B" + tier;
      case "Silver":
        return "S" + tier;
      case "Gold":
        return "G" + tier;
      case "Platinum":
        return "P" + tier;
      case "Diamond":
        return "D" + tier;
      case "Ascendant":
        return "A" + tier;
      case "Immortal":
        return "Im" + tier;
      case "Radiant":
        return "R";
      case "Unranked":
        return "Unranked";
    }
  }

  if (convertedRank(currentRankName) !== activeRiotAccount.rank) {
    // update rank with api
    try {
      await axios.patch("http://localhost:8080/api/valorant/active/update", {
        discord_id: selectedDiscordId,
        rank: convertedRank(currentRankName),
      });

      rankEmbedList[0] = rankEmbedList[0].setDescription("Rank Updated");
      await interaction.editReply({ embeds: rankEmbedList });
      console.log("LOG: \t" + "rank updated");
    } catch (error) {
      console.error(error);
    }
  }

  await browser.close();
};
