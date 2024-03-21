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
    const slot1: number = Math.floor(Math.random() * 10);
    const slot2: number = Math.floor(Math.random() * 10);
    const slot3: number = Math.floor(Math.random() * 10);

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

  const slotEmbedList: EmbedBuilder[] = [];

  const winLine: Record<number, string> = {
    0: "🔴",
    1: "🔴",
    2: "🔴",
  };

  for (let i: number = 0; i < 3; i++) {
    // if there is a jackpot
    if (
      slotOneArray[spinArray[i][0]] === slotTwoArray[spinArray[i][1]] &&
      slotOneArray[spinArray[i][0]] === slotThreeArray[spinArray[i][2]] &&
      slotTwoArray[spinArray[i][1]] === slotThreeArray[spinArray[i][2]]
    ) {
      console.log(
        "jackpot!\n" +
          slotOneArray[spinArray[i][0]] +
          slotTwoArray[spinArray[i][1]] +
          slotThreeArray[spinArray[i][2]]
      );

      winLine[i] = "🟢";

      // win line multiplier
      if (i === 0) {
        jackpotAmount += emojiToValue[slotOneArray[spinArray[i][0]]] * 2;
      } else if (i === 1) {
        jackpotAmount += emojiToValue[slotOneArray[spinArray[i][0]]] * 3;
      } else if (i === 2) {
        jackpotAmount += emojiToValue[slotOneArray[spinArray[i][0]]] * 1;
      }
      isJackpot = true;
    } else if (
      (slotOneArray[spinArray[i][0]] === slotTwoArray[spinArray[i][1]] ||
        slotTwoArray[spinArray[i][1]] === slotThreeArray[spinArray[i][2]]) &&
      !hasRefunded &&
      !isJackpot
    ) {
      // if there are a pair next to each other, has not been refunded and is not a jackpot
      winLine[i] = "🟡";

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
        `${winLine[0]}| ${slotOneArray[spinArray[0][0]]}-${
          slotTwoArray[spinArray[0][1]]
        }-${slotThreeArray[spinArray[0][2]]}` +
        "```" +
        "```" +
        `${winLine[1]}| ${slotOneArray[spinArray[1][0]]}-${
          slotTwoArray[spinArray[1][1]]
        }-${slotThreeArray[spinArray[1][2]]}` +
        "```" +
        "```" +
        `${winLine[2]}| ${slotOneArray[spinArray[2][0]]}-${
          slotTwoArray[spinArray[2][1]]
        }-${slotThreeArray[spinArray[2][2]]}` +
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
