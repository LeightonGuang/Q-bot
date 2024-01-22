const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-flip")
    .setDescription("Flip a coin"),
  async execute(interaction) {
    const randomNumber = Math.random();

    let result;

    if (randomNumber < 0.5) {
      result = {
        face: "heads",
        img: "https://media.wired.co.uk/photos/606da419ad865a997660abc3/master/w_1600,c_limit/pound-coin-front.png",
      };
    } else {
      result = {
        face: "tails",
        img: "https://media.wired.co.uk/photos/606da41a5113453af57347d2/master/w_1600,c_limit/pound-coin.png",
      };
    }

    const resultEmbed = new EmbedBuilder()
      .setColor(0xe6d6b2)
      .setTitle(result.face)
      .setThumbnail(result.img);

    try {
      await interaction.reply({
        embeds: [resultEmbed],
      });
    } catch (error) {
      console.error(error);
    }
  },
};
