import { SlashCommandBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("converter")
    .setDescription("Commands for converting metric and imperial units")
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("celsius-to-fehrenheit")
        .setDescription("convert celsius to fahrenheit")
        .addNumberOption((option) =>
          option.setName("celsius").setDescription("celsius").setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("fehrenheit-to-celsius")
        .setDescription("convert fahrenheit to celsius")
        .addNumberOption((option) =>
          option
            .setName("fehrenheit")
            .setDescription("fehrenheit")
            .setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("kg-to-lbs")
        .setDescription("convert kg to lbs")
        .addNumberOption((option) =>
          option.setName("kg").setDescription("kg").setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("lbs-to-kg")
        .setDescription("convert lbs to kg")
        .addNumberOption((option) =>
          option.setName("lbs").setDescription("lbs").setRequired(true)
        )
    ),

  async execute(interaction) {
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "celsius-to-fehrenheit": {
        const celsiusToFehrenheit: any = await import(
          "../sub-commands/conversion/celsius-to-fehrenheit.js"
        );
        celsiusToFehrenheit.subCommand(interaction);
        break;
      }
      case "fehrenheit-to-celsius": {
        const fehrenheitToCelsius: any = await import(
          "../sub-commands/conversion/fehrenheit-to-celsius.js"
        );
        fehrenheitToCelsius.subCommand(interaction);
        break;
      }
      case "kg-to-lbs": {
        break;
      }
      case "lbs-to-kg": {
        break;
      }
    }
  },
};
