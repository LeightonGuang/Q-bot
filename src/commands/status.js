const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("bot online status"),
    async execute(interaction) {
        await interaction.reply("I'm online!");
        console.log("LOG: \t I'm online!");
    },
};
