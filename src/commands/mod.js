const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("commands for mods")
    .addSubcommand(subcommand =>
      subcommand
        .setName("clear-queue")
        .setDescription("clear all the queue in data.json")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("clear-channel")
        .setDescription("delete all messages in a channel")
        .addChannelOption(option =>
          option
            .setName("clear-channel")
            .setDescription("the channel to clear all messages")
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("announcement")
        .setDescription("send announcement to a sepcific channel")
        .addChannelOption(option =>
          option
            .setName("announcement-channel")
            .setDescription("the channel to send annoucment"))
        .addStringOption(option =>
          option
            .setName("message")
            .setDescription("message to announce")
        )

    ),

  async execute(interaction) {
    let subCommand = interaction.options.getSubcommand();

    if (subCommand === "clear-queue") {
      await interaction.reply({ content: "queue cleared", ephemeral: true });
      console.log("LOG: \t" + "queue cleared");

    } else if (subCommand === "clear-channel") {
      let clearChannel = interaction.options.getChannel("clear-channel");

      await interaction.reply({ content: `${clearChannel} channel is cleared`, ephemeral: true });
      console.log("LOG: \t" + "channel cleared");

      let fetched = await clearChannel.messages.fetch();
      await clearChannel.bulkDelete(fetched);

    } else if (subCommand === "announcement") {
      let message = interaction.options.getString("message");
      let annoucmentChannel = interaction.options.getChannel("announcement-channel");

      await interaction.reply({ content: `announcement sent to ${annoucmentChannel} `, ephemeral: true });
      console.log("LOG: \t" + `announcement sent to ${annoucmentChannel}`);

      annoucmentChannel.send(message);
    }
  }
}