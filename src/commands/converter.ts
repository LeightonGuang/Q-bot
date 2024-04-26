import { SlashCommandBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("converter")
    .setDescription("Commands for converting metric and imperial units")
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("celsius-to-fahrenheit")
        .setDescription("convert celsius to fahrenheit")
        .addNumberOption((option) =>
          option.setName("celsius").setDescription("celsius").setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("fahrenheit-to-celsius")
        .setDescription("convert fahrenheit to celsius")
        .addNumberOption((option) =>
          option
            .setName("fahrenheit")
            .setDescription("fahrenheit")
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
      case "celsius-to-fahrenheit": {
        const celsiusTofahrenheit: any = await import(
          "../sub-commands/conversion/celsius-to-fahrenheit.js"
        );
        celsiusTofahrenheit.subCommand(interaction);
        break;
      }
      case "fahrenheit-to-celsius": {
        const fahrenheitToCelsius: any = await import(
          "../sub-commands/conversion/fahrenheit-to-celsius.js"
        );
        fahrenheitToCelsius.subCommand(interaction);
        break;
      }
      case "kg-to-lbs": {
        const kgToLbs: any = await import(
          "../sub-commands/conversion/kg-to-lbs.js"
        );
        kgToLbs.subCommand(interaction);
        break;
      }
      case "lbs-to-kg": {
        break;
      }
    }
  },
};
