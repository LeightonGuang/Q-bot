import { EmbedBuilder } from "discord.js";

export const subCommand: any = async (interaction) => {
  const fahrenheit: number = interaction.options.getNumber("fahrenheit");
  let celsius: number = ((fahrenheit - 32) * 5) / 9;

  celsius = Math.round(celsius * 10) / 10;

  const convertedEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("fahrenheit to Celsius")
    .setDescription("```" + `${fahrenheit}°F = ${celsius}°C` + "```");

  await interaction.reply({ embeds: [convertedEmbed] });
};
