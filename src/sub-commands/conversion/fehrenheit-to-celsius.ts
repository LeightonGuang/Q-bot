import { EmbedBuilder } from "discord.js";

export const subCommand: any = async (interaction) => {
  const fehrenheit: number = interaction.options.getNumber("fehrenheit");
  let celsius: number = ((fehrenheit - 32) * 5) / 9;

  celsius = Math.round(celsius * 10) / 10;

  const convertedEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Fehrenheit to Celsius")
    .setDescription("```" + `${fehrenheit}°F = ${celsius}°C` + "```");

  await interaction.reply({ embeds: [convertedEmbed] });
};
