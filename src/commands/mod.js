const { SlashCommandBuilder } = require('discord.js');
const { clear } = require('node:console');
const fs = require("node:fs");
const writeToFile = require("../utils/writeToFile");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("commands for mods")
    .addSubcommand(subcommand =>
      subcommand
        .setName("delete-all-queue")
        .setDescription("delete all the queues in data.json")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("clear-channel")
        .setDescription("delete all messages in a channel")
        .addChannelOption(option =>
          option
            .setName("clear-channel")
            .setDescription("the channel to clear all messages")
        ))

    .addSubcommand(subcommand =>
      subcommand
        .setName("announcement")
        .setDescription("send announcement to a sepcific channel")
        .addStringOption(option =>
          option
            .setName("message")
            .setDescription("message to announce")
            .setRequired(true))
        .addChannelOption(option =>
          option
            .setName("announcement-channel")
            .setDescription("the channel to send annoucment")
        )),

  async execute(interaction) {
    let subCommand = interaction.options.getSubcommand();

    if (subCommand === "delete-all-queue") {
      await interaction.reply({ content: "all queues deleted in data.json", ephemeral: true });
      console.log("LOG: \t" + "all queues deleted in data.json");

      let dataFile = fs.readFileSync("data.json");
      let dataObj = JSON.parse(dataFile);

      dataObj.duoRankList = [];
      dataObj.trioRankList = [];
      dataObj.fiveStackRankList = [];
      dataObj.oneVoneList = [];
      dataObj.tenMansList = [];
      dataObj.customVoiceChannel = [];
      dataObj.vcInvite = [];

      writeToFile(dataObj, "data.json");

      //clear queue-notification channel

    } else if (subCommand === "clear-channel") {
      let clearChannel = interaction.options.getChannel("clear-channel");

      //if no specific channel is selected, set default to the channel it was used
      if (clearChannel === null) {
        clearChannel = interaction.channel;
      }

      await interaction.reply({ content: `${clearChannel} channel is cleared`, ephemeral: true });
      console.log("LOG: \t" + "channel cleared");

      let fetched = await clearChannel.messages.fetch();
      await clearChannel.bulkDelete(fetched);

    } else if (subCommand === "announcement") {
      let message = interaction.options.getString("message");
      let annoucmentChannel = interaction.options.getChannel("announcement-channel");

      if (annoucmentChannel === null) {
        annoucmentChannel = interaction.channel;
      }

      await interaction.reply({ content: `announcement sent to ${annoucmentChannel} `, ephemeral: true });
      console.log("LOG: \t" + `announcement sent to ${annoucmentChannel}`);

      annoucmentChannel.send(message);
    }
  }
}