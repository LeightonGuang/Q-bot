import { EmbedBuilder } from "discord.js";

export const subCommand = async (interaction) => {
  const rulesEmbed: EmbedBuilder = new EmbedBuilder()
    .setTitle("Gamble Rules")
    .setColor(0xffd700)
    .addFields(
      {
        name: "Symbols' payout",
        value: `
      💎 = 1000 Qoins
      ⭐️ = 500 Qoins
      7️⃣ = 250 Qoins
      🔔 = 150 Qoins
      ➖ = 100 Qoins
      🍉 = 75 Qoins
      🍌 = 50 Qoins
      🍋 = 25 Qoins
      🍊 = 10 Qoins
      🍒 = 5 Qoins
      `,
        inline: true,
      },
      {
        name: "Refund",
        value:
          `
        If you have 2 of the same symbols next to each other, you get a refund up to 10 Qoins
      Example:\n` +
          "```|-7️⃣-7️⃣-🍊-|```" +
          `
        Your bet 30 Qoins -> 10 Qoins refund.
        Your bet 10 Qoins -> 10 Qoins refund.
        Your bet 5 Qoins -> 5 Qoins refund.
          `,
        inline: true,
      }
    );

  await interaction.reply({ embeds: [rulesEmbed] });
};
