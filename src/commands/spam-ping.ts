import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data: any = {
  data: new SlashCommandBuilder()
    .setName("spam-ping")
    .setDescription("Spam ping someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("user").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("times")
        .setDescription("how many times to ping someone")
        .setRequired(true)
    ),
  async execute(interaction) {
    const selectedDiscordId: string = interaction.options.getMember("user");
    const times: number = interaction.options.getInteger("times");

    if (times < 10) {
      await interaction.reply({
        content: "Please enter a number less than or equal to 10",
        ephemeral: true,
      });
      return;
    } else if (times <= 10) {
      await interaction.deferReply();
      for (let i: number = 0; i < times; i++) {
        await interaction.channel.send(`${selectedDiscordId}`);
      }
    }
  },
};
