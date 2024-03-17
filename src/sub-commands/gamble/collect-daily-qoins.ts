import axios from "axios";

export const subCommand: any = async (interaction) => {
  const discordId: string = interaction.member.id;

  try {
    const { data }: { data: any } = await axios.get(
      "http://localhost:8080/api/account/balance/checkin/" + discordId
    );

    const { success, balance }: { success: boolean; balance: number } = data;

    if (success) {
      await interaction.reply({
        content: `You have collected daily qoins. \nYou have ${balance} Qoins`,
        ephemeral: true,
      });
    } else if (!success) {
      await interaction.reply({
        content:
          "You have already collected your daily qoins. Come back tomorrow!",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
