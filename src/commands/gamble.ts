import { SlashCommandBuilder } from "discord.js";

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
    const slot = await import("../sub-commands/gamble/slots.js");
    slot.subCommand(interaction);
  },
};
