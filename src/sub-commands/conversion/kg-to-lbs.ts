import { EmbedBuilder } from "discord.js";

export const subCommand = async (interaction) => {
  const kg: number = interaction.options.getNumber("kg");

  let lbs: number = kg * 2.20462;
  lbs = Math.round(lbs * 10) / 10;

  const convertedEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Kg to Lbs")
    .setDescription("```" + `${kg}kg = ${lbs}lbs` + "```");

  await interaction.reply({ embeds: [convertedEmbed] });
};
