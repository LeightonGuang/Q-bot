import { SlashCommandBuilder } from "discord.js";

export const data = {
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
