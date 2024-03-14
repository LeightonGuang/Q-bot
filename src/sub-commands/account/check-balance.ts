import axios from "axios";
import { Balance } from "../../types/Balance.js";

export const subCommand = async (interaction) => {
  try {
    const { data }: { data: Balance[] } = await axios.get(
      "http://localhost:8080/api/account/balance/get/" + interaction.member.id
    );

    await interaction.reply({
      content: `You have **${data[0].balance} ${
        data[0].balance === 1 ? "Qoin" : "Qoins"
      }** in your account`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
  }
};
