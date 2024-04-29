import { EmbedBuilder } from "discord.js";

export const subCommand: any = async (interaction) => {
  const lbs: number = interaction.options.getNumber("lbs");
  let kg: number = lbs / 2.20462;
  kg = Math.round(kg * 10) / 10;

  const convertedEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffffff)
    .setTitle("Lbs to Kg")
    .setDescription("```" + `${lbs}lbs = ${kg}kg` + "```");

  await interaction.reply({ embeds: [convertedEmbed] });
};
