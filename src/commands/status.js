const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("get status of all queue"),

  async execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    await interaction.reply(data.name);
    console.log("LOG: \t" + JSON.stringify(data));
  },
};
