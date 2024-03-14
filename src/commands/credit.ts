import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data: any = {
  data: new SlashCommandBuilder()
    .setName("credit")
    .setDescription("Thank you to all the people that helped"),
  async execute(interaction) {
    const creditEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xffd700)
      .setAuthor({ name: "Q bot" })
      .setTitle("Credit")
      .setDescription("Thank you to the people that helped made Q bot")
      .addFields({
        name: "<:Pog:1139840279659159582>",
        value: "<@691784137790717984>",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [creditEmbed] });
  },
};
