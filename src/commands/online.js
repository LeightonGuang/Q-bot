const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("online")
        .setDescription("bot online status"),
    async execute(interaction) {
        await interaction.reply("I'm online!");
        console.log("LOG: \t I'm online!");
    },
};
