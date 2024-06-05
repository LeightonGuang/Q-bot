import { SlashCommandBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("converter")
    .setDescription(
      "Commands for converting metric to imperial units, currency, etc."
    )
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
        .setDescription("convert kilograms to pounds")
        .addNumberOption((option) =>
          option.setName("kg").setDescription("kg").setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("lbs-to-kg")
        .setDescription("convert pounds to kilograms")
        .addNumberOption((option) =>
          option.setName("lbs").setDescription("lbs").setRequired(true)
        )
    )
    .addSubcommand((addSubcommand) =>
      addSubcommand
        .setName("currency")
        .setDescription("convert any currency")
        .addNumberOption((option) =>
          option.setName("amount").setDescription("amount").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("from")
            .setDescription("from")
            .setChoices(
              { name: "Canadian Dollars", value: "CAD" },
              { name: "Chinese Yuan", value: "CNY" },
              { name: "Euros", value: "EUR" },
              { name: "Hong Kong Dollars", value: "HKD" },
              { name: "Great British Pounds", value: "GBP" },
              { name: "Indian Rupee", value: "INR" },
              { name: "Indonesian Rupiah", value: "IDR" },
              { name: "Japanese Yen", value: "JPY" },
              { name: "Korean Won", value: "KRW" },
              { name: "Malaysian Ringgit", value: "MYR" },
              { name: "Philippine Peso", value: "PHP" },
              { name: "Singapore Dollars", value: "SGD" },
              { name: "US Dollars", value: "USD" }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("to")
            .setDescription("to")
            .setChoices(
              { name: "Canadian Dollars", value: "CAD" },
              { name: "Chinese Yuan", value: "CNY" },
              { name: "Euros", value: "EUR" },
              { name: "Hong Kong Dollars", value: "HKD" },
              { name: "Great British Pounds", value: "GBP" },
              { name: "Indian Rupee", value: "INR" },
              { name: "Indonesian Rupiah", value: "IDR" },
              { name: "Japanese Yen", value: "JPY" },
              { name: "Korean Won", value: "KRW" },
              { name: "Malaysian Ringgit", value: "MYR" },
              { name: "Philippine Peso", value: "PHP" },
              { name: "Singapore Dollars", value: "SGD" },
              { name: "US Dollars", value: "USD" }
            )
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subCommand: string = interaction.options.getSubcommand();

    switch (subCommand) {
      case "celsius-to-fahrenheit": {
        const celsiusTofahrenheit: any = await import(
          "../sub-commands/converter/celsius-to-fahrenheit.js"
        );
        celsiusTofahrenheit.subCommand(interaction);
        break;
      }
      case "fahrenheit-to-celsius": {
        const fahrenheitToCelsius: any = await import(
          "../sub-commands/converter/fahrenheit-to-celsius.js"
        );
        fahrenheitToCelsius.subCommand(interaction);
        break;
      }
      case "kg-to-lbs": {
        const kgToLbs: any = await import(
          "../sub-commands/converter/kg-to-lbs.js"
        );
        kgToLbs.subCommand(interaction);
        break;
      }
      case "lbs-to-kg": {
        const lbsToKg: any = await import(
          "../sub-commands/converter/lbs-to-kg.js"
        );
        lbsToKg.subCommand(interaction);
        break;
      }
      case "currency": {
        const currency: any = await import(
          "../sub-commands/converter/currency.js"
        );
        currency.subCommand(interaction);
        break;
      }
    }
  },
};
