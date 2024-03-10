export const subCommand = async (interaction) => {
  const qoinAmmount: number = interaction.options.get("qoins").value;

  const slotIconsArray: string[] = [
    "🍒",
    "➖",
    "7️⃣",
    "🔔",
    "💎",
    "⭐️",
    "🍋",
    "🍊",
    "🍉",
    "🍌",
  ];

  const getRandomIcon = () => {
    return slotIconsArray[Math.floor(Math.random() * slotIconsArray.length)];
  };

  await interaction.reply({
    content: `You bet ${qoinAmmount} ${
      qoinAmmount > 1 ? "Qoins" : "Qoin"
    }\n${getRandomIcon()}-${getRandomIcon()}-${getRandomIcon()}`,
    ephemeral: false,
  });
};
