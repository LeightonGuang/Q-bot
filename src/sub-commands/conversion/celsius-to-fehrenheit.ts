import { EmbedBuilder } from "discord.js";

export const subCommand = async (interaction) => {
  const celsius: number = interaction.options.getNumber("celsius");
  const fahrenheit: number = (celsius * 9) / 5 + 32;

  const convertedEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Celsius to Fahrenheit")
    .setDescription("```" + `${celsius}°C = ${fahrenheit}°F` + "```");

  await interaction.reply({ embeds: [convertedEmbed] });
};
