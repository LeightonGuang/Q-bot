const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("ping the bot to check online status"),
    async execute(interaction) {
        await interaction.reply({
            content: "I'm online!",
            ephemeral: true,
        });
        console.log("LOG: \t I'm online!");
    },
};
