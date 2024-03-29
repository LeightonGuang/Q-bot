import { EmbedBuilder } from "discord.js";
import axios from "axios";
import { Balance } from "../../types/Balance.js";

export const subCommand = async (interaction) => {
  const reelOneArray: string[] = [
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

  const reelTwoArray: string[] = [
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

  const reelThreeArray: string[] = [
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

  const emojiToValue: Record<string, number> = {
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
    const reelOneIndex: number = Math.floor(Math.random() * 10);
    const reelTwoIndex: number = Math.floor(Math.random() * 10);
    const reelThreeIndex: number = Math.floor(Math.random() * 10);

    return [
      [
        reelOneIndex - 1 < 0 ? 9 : reelOneIndex - 1,
        reelTwoIndex - 1 < 0 ? 9 : reelTwoIndex - 1,
        reelThreeIndex - 1 < 0 ? 9 : reelThreeIndex - 1,
      ],
      [reelOneIndex, reelTwoIndex, reelThreeIndex],
      [
        reelOneIndex + 1 > 9 ? 0 : reelOneIndex + 1,
        reelTwoIndex + 1 > 9 ? 0 : reelTwoIndex + 1,
        reelThreeIndex + 1 > 9 ? 0 : reelThreeIndex + 1,
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

  const slotEmbedList: EmbedBuilder[] = [];

  const payline: Record<number, string> = {
    0: "🔴",
    1: "🔴",
    2: "🔴",
  };

  for (let paylineIndex: number = 0; paylineIndex < 3; paylineIndex++) {
    // check payline for jackpot
    const reelOne = (paylineIndex) => {
      return reelOneArray[spinArray[paylineIndex][0]];
    };

    const reelTwo = (paylineIndex) => {
      return reelTwoArray[spinArray[paylineIndex][1]];
    };

    const reelThree = (paylineIndex) => {
      return reelThreeArray[spinArray[paylineIndex][2]];
    };

    if (
      reelOne(paylineIndex) === reelTwo(paylineIndex) &&
      reelOne(paylineIndex) === reelThree(paylineIndex) &&
      reelTwo(paylineIndex) === reelThree(paylineIndex)
    ) {
      console.log(
        "jackpot!\n" +
          reelOneArray[spinArray[paylineIndex][0]] +
          reelTwoArray[spinArray[paylineIndex][1]] +
          reelThreeArray[spinArray[paylineIndex][2]]
      );

      payline[paylineIndex] = "🟢";

      // win line multiplier
      if (paylineIndex === 0) {
        // get the value of the first slot icon for jackpot
        jackpotAmount +=
          emojiToValue[reelOneArray[spinArray[paylineIndex][0]]] * 2;
      } else if (paylineIndex === 1) {
        jackpotAmount +=
          emojiToValue[reelOneArray[spinArray[paylineIndex][0]]] * 3;
      } else if (paylineIndex === 2) {
        jackpotAmount +=
          emojiToValue[reelOneArray[spinArray[paylineIndex][0]]] * 1;
      }
      isJackpot = true;
    } else if (
      // if there is a pair next to each other, has not been refunded and is not a jackpot
      (reelOneArray[spinArray[paylineIndex][0]] ===
        reelTwoArray[spinArray[paylineIndex][1]] ||
        reelTwoArray[spinArray[paylineIndex][1]] ===
          reelThreeArray[spinArray[paylineIndex][2]]) &&
      !hasRefunded &&
      !isJackpot
    ) {
      payline[paylineIndex] = "🟡";

      if (bet > maxRefund) {
        // you get your 10 qoins back
        refundAmount += maxRefund;
      } else if (bet <= maxRefund) {
        // you get back your bet
        refundAmount += bet;
      }

      hasRefunded = true;
    }
  }

  const slotEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(isJackpot ? 0x00ff00 : hasRefunded ? 0xffff00 : 0xff0000)
    .setTitle("Slots")
    .setDescription(
      "```" +
        `${payline[0]} |${reelOneArray[spinArray[0][0]]}| |${
          reelTwoArray[spinArray[0][1]]
        }| |${reelThreeArray[spinArray[0][2]]}|` +
        "```" +
        "```" +
        `${payline[1]} |${reelOneArray[spinArray[1][0]]}| |${
          reelTwoArray[spinArray[1][1]]
        }| |${reelThreeArray[spinArray[1][2]]}|` +
        "```" +
        "```" +
        `${payline[2]} |${reelOneArray[spinArray[2][0]]}| |${
          reelTwoArray[spinArray[2][1]]
        }| |${reelThreeArray[spinArray[2][2]]}|` +
        "```"
    );
  // 🟩🟢🟨🟡🔴🟥

  slotEmbedList.push(slotEmbed);

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
        name: `${
          hasRefunded ? "Refund:" : isJackpot ? "JACKPOT:" : "Winnings:"
        }`,
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
