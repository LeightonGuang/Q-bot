import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { Balance } from "../types/Balance.js";

export const data: any = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Commands for gambling")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("slots")
        .setDescription("Play slots!")
        .addIntegerOption((option) =>
          option
            .setName("qoins")
            .setDescription("Qoins to gamble")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const bet: number = interaction.options.get("qoins").value;

    // check if user has enough qoins
    try {
      const { data }: { data: Balance[] } = await axios.get(
        "http://localhost:8080/api/account/balance/get/" + interaction.member.id
      );
      if (data[0].balance < bet) {
        await interaction.reply({
          content: `You placed a ${bet} Qoin bet, but you only have ${data[0].balance} Qoins`,
          ephemeral: true,
        });
        return;
      } else if (data[0].balance === 0) {
        await interaction.reply({
          content: "You don't have 0 Qoins in your account",
          ephemeral: true,
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }

    const slot = await import("../sub-commands/gamble/slots.js");
    slot.subCommand(interaction);
  },
};
