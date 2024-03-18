import { EmbedBuilder } from "discord.js";
import axios from "axios";
import { Balance } from "../../types/Balance.js";

export const subCommand = async (interaction) => {
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

  const emojiToValue = {
    "💎": 1000,
    "⭐️": 500,
    "7️⃣": 250,
    "🔔": 150,
    "➖": 100,
    "🍉": 75,
    "🍌": 50,
    "🍋": 25,
    "🍊": 10,
    "🍒": 5,
  };

  const bet: number = interaction.options.get("qoins").value;
  let hasRefunded: boolean = false;
  let isJackpot: boolean = false;
  let jackpotAmount: number = 0;
  let refundAmount: number = 0;
  const maxRefund: number = 10;

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

  try {
    await axios.post("http://localhost:8080/api/account/balance/edit", {
      discord_id: interaction.member.id,
      balance: "-" + bet,
    });
  } catch (error) {
    console.error(error);
  }

  const spinArray: number[][] = slotRandomNumberList();
  console.log(spinArray);

  const slotEmbedList = [];

  // winning line 1
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
    // jackpot on line 1
    slotOneArray[spinArray[0][0]] === slotTwoArray[spinArray[0][1]] &&
    slotOneArray[spinArray[0][0]] === slotThreeArray[spinArray[0][2]] &&
    slotTwoArray[spinArray[0][1]] === slotThreeArray[spinArray[0][2]]
  ) {
    console.log(
      "jackpot!\n" +
        slotOneArray[spinArray[0][0]] +
        slotTwoArray[spinArray[0][1]] +
        slotThreeArray[spinArray[0][2]]
    );

    line1Embed.setColor(0x00ff00);

    jackpotAmount += emojiToValue[slotOneArray[spinArray[0][0]]] * 2;
    isJackpot = true;
  } else if (
    // if there are a pair next to each other, has not been refunded and is not a jackpot
    (slotOneArray[spinArray[0][0]] === slotTwoArray[spinArray[0][1]] ||
      slotTwoArray[spinArray[0][1]] === slotThreeArray[spinArray[0][2]]) &&
    !hasRefunded &&
    !isJackpot
  ) {
    line1Embed.setColor(0xffff00);

    if (bet > maxRefund) {
      // you get your 10 qoins back
      refundAmount += maxRefund;
    } else if (bet <= maxRefund) {
      // you get back your bet
      refundAmount += bet;
    }

    hasRefunded = true;
  }

  slotEmbedList.push(line1Embed);

  // winning line 2
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
    // jackpot on line 2
    slotOneArray[spinArray[1][0]] === slotTwoArray[spinArray[1][1]] &&
    slotOneArray[spinArray[1][0]] === slotThreeArray[spinArray[1][2]] &&
    slotTwoArray[spinArray[1][1]] === slotThreeArray[spinArray[1][2]]
  ) {
    console.log(
      "jackpot!\n" +
        slotOneArray[spinArray[1][0]] +
        slotTwoArray[spinArray[1][1]] +
        slotThreeArray[spinArray[1][2]]
    );

    line2Embed.setColor(0x00ff00);

    jackpotAmount += emojiToValue[slotOneArray[spinArray[1][0]]] * 3;
    isJackpot = true;
  } else if (
    // if there are a pair next to each other
    (slotOneArray[spinArray[1][0]] === slotTwoArray[spinArray[1][1]] ||
      slotTwoArray[spinArray[1][1]] === slotThreeArray[spinArray[1][2]]) &&
    !hasRefunded &&
    !isJackpot
  ) {
    line2Embed.setColor(0xffff00);

    if (bet > maxRefund) {
      // you get your 10 qoins back
      refundAmount += maxRefund;
    } else if (bet <= maxRefund) {
      // you get back your bet
      refundAmount += bet;
    }

    hasRefunded = true;
  }

  slotEmbedList.push(line2Embed);

  // winning line 3
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
    // jackpot on line 3
    slotOneArray[spinArray[2][0]] === slotTwoArray[spinArray[2][1]] &&
    slotOneArray[spinArray[2][0]] === slotThreeArray[spinArray[2][2]] &&
    slotTwoArray[spinArray[2][1]] === slotThreeArray[spinArray[2][2]]
  ) {
    console.log(
      "jackpot!\n" +
        slotOneArray[spinArray[2][0]] +
        slotTwoArray[spinArray[2][1]] +
        slotThreeArray[spinArray[2][2]]
    );

    line3Embed.setColor(0x00ff00);

    jackpotAmount += emojiToValue[slotOneArray[spinArray[2][0]]] * 1;
    isJackpot = true;
  } else if (
    // if there are a pair next to each other
    (slotOneArray[spinArray[2][0]] === slotTwoArray[spinArray[2][1]] ||
      slotTwoArray[spinArray[2][1]] === slotThreeArray[spinArray[2][2]]) &&
    !hasRefunded &&
    !isJackpot
  ) {
    line3Embed.setColor(0xffff00);

    if (bet > maxRefund) {
      // you get your 10 qoins back
      refundAmount += maxRefund;
    } else if (bet <= maxRefund) {
      // you get back your bet
      refundAmount += bet;
    }

    hasRefunded = true;
  }
  slotEmbedList.push(line3Embed);

  if (isJackpot) {
    jackpotAmount += bet;
    refundAmount = 0;
  }

  try {
    await axios.post("http://localhost:8080/api/account/balance/edit", {
      discord_id: interaction.member.id,
      balance: "+" + jackpotAmount + refundAmount,
    });
  } catch (error) {
    console.error(error);
  }

  const { data }: { data: Balance[] } = await axios.get(
    "http://localhost:8080/api/account/balance/get/" + interaction.member.id
  );

  const accountBalance: string = data[0].balance.toString();

  const balanceEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xffd700)
    .addFields(
      { name: "Your bet:", value: `${bet.toString()}`, inline: true },
      {
        name: "Winnings:",
        value: `${
          jackpotAmount !== 0
            ? jackpotAmount.toString()
            : refundAmount.toString()
        }`,
        inline: true,
      },
      { name: "Balance:", value: accountBalance, inline: true }
    );

  slotEmbedList.push(balanceEmbed);

  await interaction.reply({
    embeds: slotEmbedList,
    ephemeral: false,
  });
};
