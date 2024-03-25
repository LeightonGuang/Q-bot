import { EmbedBuilder } from "discord.js";

export const subCommand = async (interaction) => {
  const rulesEmbed: EmbedBuilder = new EmbedBuilder()
    .setTitle("Gamble Rules")
    .setColor(0xffd700)
    .addFields(
      {
        name: "Slots",
        value:
          "```Payline 1 | 🔴 |💎| |🍒| |🍌|```" +
          "```Payline 2 | 🔴 |⭐️| |💎| |7️⃣|```" +
          "```Payline 3 | 🟡 |7️⃣| |7️⃣| |💎|```",
        inline: false,
      },
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
          "If you have 2 of the same symbols next to each other, you get a refund up to 10 Qoins\n\nExample:" +
          "```🟡 |7️⃣| |7️⃣| |💎|```" +
          "Your bet 30 Qoins -> 10 Qoins refund.\n\n" +
          "Your bet 10 Qoins -> 10 Qoins refund.\n\n" +
          "Your bet 5 Qoins -> 5 Qoins refund.",
        inline: true,
      },
      {
        name: "Payline multiplier",
        value:
          "```Payline 1 = 2x bet```" +
          "```Payline 2 = 3x bet```" +
          "```Payline 3 = 1x bet```",
        inline: true,
      }
    );

  await interaction.reply({ embeds: [rulesEmbed] });
};
