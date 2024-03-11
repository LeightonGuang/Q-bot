import { Embed, EmbedBuilder } from "discord.js";

export const subCommand = async (interaction) => {
  const bet: number = interaction.options.get("qoins").value;

  const slotOneArray: string[] = [
    "💎",
    "⭐️",
    "7️⃣",
    "🔔",
    "➖",
    "🍉",
    "🍌",
    "🍋",
    "🍊",
    "🍒",
  ];

  const slotTwoArray: string[] = [
    "⭐️",
    "🍌",
    "🔔",
    "🍋",
    "➖",
    "🍒",
    "💎",
    "7️⃣",
    "🍉",
    "🍊",
  ];

  const slotThreeArray: string[] = [
    "🔔",
    "🍒",
    "🍉",
    "➖",
    "🍌",
    "7️⃣",
    "💎",
    "🍊",
    "⭐️",
    "🍋",
  ];

  let winnings: number = 0;

  const slotRandomNumberList = () => {
    const slot1 = Math.floor(Math.random() * 10);
    const slot2 = Math.floor(Math.random() * 10);
    const slot3 = Math.floor(Math.random() * 10);

    return [
      [
        slot1 - 1 < 0 ? 9 : slot1 - 1,
        slot2 - 1 < 0 ? 9 : slot2 - 1,
        slot3 - 1 < 0 ? 9 : slot3 - 1,
      ],
      [slot1, slot2, slot3],
      [
        slot1 + 1 > 9 ? 0 : slot1 + 1,
        slot2 + 1 > 9 ? 0 : slot2 + 1,
        slot3 + 1 > 9 ? 0 : slot3 + 1,
      ],
    ];
  };

  const spinArray: number[][] = slotRandomNumberList();
  console.log(spinArray);

  const slotEmbedList = [];
  const line1Embed = new EmbedBuilder().setColor(0xff0000).addFields(
    {
      name: "\u200B",
      value: slotOneArray[spinArray[0][0]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotTwoArray[spinArray[0][1]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotThreeArray[spinArray[0][2]],
      inline: true,
    }
  );

  if (
    slotOneArray[spinArray[0][0]] === slotTwoArray[spinArray[0][1]] &&
    slotOneArray[spinArray[0][0]] === slotThreeArray[spinArray[0][2]]
  ) {
    console.log(
      slotOneArray[spinArray[0][0]] +
        slotOneArray[spinArray[0][1]] +
        slotOneArray[spinArray[0][2]]
    );
    line1Embed.setColor(0x00ff00);
  }

  slotEmbedList.push(line1Embed);

  const line2Embed = new EmbedBuilder().setColor(0xff0000).addFields(
    {
      name: "\u200B",
      value: slotOneArray[spinArray[1][0]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotTwoArray[spinArray[1][1]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotThreeArray[spinArray[1][2]],
      inline: true,
    }
  );

  if (
    slotOneArray[spinArray[1][0]] === slotTwoArray[spinArray[1][1]] &&
    slotOneArray[spinArray[1][0]] === slotThreeArray[spinArray[1][2]]
  ) {
    console.log(
      slotOneArray[spinArray[1][0]] +
        slotOneArray[spinArray[1][1]] +
        slotOneArray[spinArray[1][2]]
    );
    line2Embed.setColor(0x00ff00);
  }

  slotEmbedList.push(line2Embed);

  const line3Embed = new EmbedBuilder().setColor(0xff0000).addFields(
    {
      name: "\u200B",
      value: slotOneArray[spinArray[2][0]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotTwoArray[spinArray[2][1]],
      inline: true,
    },
    {
      name: "\u200B",
      value: slotThreeArray[spinArray[2][2]],
      inline: true,
    }
  );

  if (
    slotOneArray[spinArray[2][0]] === slotTwoArray[spinArray[2][1]] &&
    slotOneArray[spinArray[2][0]] === slotThreeArray[spinArray[2][2]]
  ) {
    console.log(
      slotOneArray[spinArray[2][0]] +
        slotOneArray[spinArray[2][1]] +
        slotOneArray[spinArray[2][2]]
    );
    line3Embed.setColor(0x00ff00);
  }

  slotEmbedList.push(line3Embed);

  const balanceEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffd700)
    .addFields(
      { name: "Your bet:", value: `${bet.toString()}`, inline: true },
      { name: "Wins:", value: `${winnings.toString()}`, inline: true },
      { name: "Balance:", value: `1000`, inline: true }
    );

  slotEmbedList.push(balanceEmbed);

  await interaction.reply({
    embeds: slotEmbedList,
    ephemeral: true,
  });
};
