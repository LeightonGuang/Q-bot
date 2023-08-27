const { SlashCommandBuilder } = require("discord.js");
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

    let subCommand = interaction.options.getSubcommand();

    if (subCommand === "ongoing-events") {
      const ongoingEvents = require("../sub-commands/valorant/ongoing-events");
      ongoingEvents(interaction);
    } else if (subCommand === "upcoming-events") {
      const upcomingEvents = require("../sub-commands/valorant/upcoming-events");
      upcomingEvents(interaction);
    } else if (subCommand === "check-rank") {
      let checkRank = require("../sub-commands/valorant/check-rank");
      checkRank(interaction);
    } else if (subCommand === "win-percentage") {
      let winPercentage = require("../sub-commands/valorant/win-percentage");
      winPercentage(interaction);
    } else if (subCommand === "last-game-stats") {
      let lastGameStats = require("../sub-commands/valorant/last-game-stats");
      lastGameStats(interaction);
    }
  },
};
