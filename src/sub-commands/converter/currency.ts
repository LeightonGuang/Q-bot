import { EmbedBuilder } from "discord.js";
import axios from "axios";

export const subCommand = async (interaction) => {
  const amount: number = interaction.options.getNumber("amount");
  const fromCurrency: string = interaction.options.getString("from");
  const toCurrency: string = interaction.options.getString("to");

  if (fromCurrency === toCurrency) {
    // they're both the same currency
    const convertedEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Currency Conversion")
      .setDescription(
        "```" + `${amount} ${fromCurrency} = ${amount} ${toCurrency}` + "```"
      );
    await interaction.reply({ embeds: [convertedEmbed] });
    return;
  }

  const FREECURRENCYAPI_KEY: string = process.env.FREECURRENCYAPI_KEY;

  const RequestUrl: string =
    "https://api.freecurrencyapi.com/v1/latest?apikey=";
  try {
    const {
      data: { data },
    }: { data: { data: any } } = await axios.get(
      RequestUrl +
        FREECURRENCYAPI_KEY +
        "&base_currency=" +
        fromCurrency +
        "&currencies=" +
        toCurrency
    );

    const conversionRate: number = data[toCurrency];
    let convertedAmount: number = amount * conversionRate;

    convertedAmount = Math.round(convertedAmount * 100) / 100;

    const convertedEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Currency Conversion")
      .setDescription(
        "```" +
          `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}` +
          "```"
      );
    await interaction.reply({ embeds: [convertedEmbed] });
  } catch (error) {
    console.error(error);
  }
};
