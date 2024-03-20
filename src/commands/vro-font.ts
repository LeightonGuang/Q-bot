import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

export const data = {
  data: new SlashCommandBuilder()
    .setName("vro-font")
    .setDescription("Convert your text to a vro font")
    .addStringOption((option) =>
      option
        .setName("sentence")
        .setDescription("Sentence you want to convert")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User you want to ping")
    ),

  async execute(interaction) {
    const inputSentence: string = interaction.options.getString("sentence");
    const pingUser: string = interaction.options.getMember("user");

    // 𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩 𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃
    const vroFont: object = {
      A: "𝓐",
      B: "𝓑",
      C: "𝓒",
      D: "𝓓",
      E: "𝓔",
      F: "𝓕",
      G: "𝓖",
      H: "𝓗",
      I: "𝓘",
      J: "𝓙",
      K: "𝓚",
      L: "𝓛",
      M: "𝓜",
      N: "𝓝",
      O: "𝓞",
      P: "𝓟",
      Q: "𝓠",
      R: "𝓡",
      S: "𝓢",
      T: "𝓣",
      U: "𝓤",
      V: "𝓥",
      W: "𝓦",
      X: "𝓧",
      Y: "𝓨",
      Z: "𝓩",
      a: "𝓪",
      b: "𝓫",
      c: "𝓬",
      d: "𝓭",
      e: "𝓮",
      f: "𝓯",
      g: "𝓰",
      h: "𝓱",
      i: "𝓲",
      j: "𝓳",
      k: "𝓴",
      l: "𝓵",
      m: "𝓶",
      n: "𝓷",
      o: "𝓸",
      p: "𝓹",
      q: "𝓺",
      r: "𝓻",
      s: "𝓼",
      t: "𝓽",
      u: "𝓾",
      v: "𝓿",
      w: "𝔀",
      x: "𝔁",
      y: "𝔂",
      z: "𝔃",
    };

    const maxWord: number = 50;
    const maxChar: number = 250;

    const isMoreThanMaxWord: boolean =
      inputSentence.split(" ").length > maxWord;
    const isMoreThanMaxChar: boolean = inputSentence.length > maxChar;

    if (isMoreThanMaxWord) {
      await interaction.reply({
        content:
          "Plese keep your sentence under 50 words. " +
          `***(${inputSentence.split(" ").length} words)***`,
        ephemeral: true,
      });
      return;
    } else if (isMoreThanMaxChar) {
      await interaction.reply({
        content:
          "Please keep your sentence under 250 characters. " +
          `***(${inputSentence.length} characters)***`,

        ephemeral: true,
      });
      return;
    }

    const sentenceCharList: string[] = inputSentence.split("");
    const convertedSentenceList: string[] = sentenceCharList.map((char) => {
      const newFont: string = vroFont[char];

      if (newFont) {
        return newFont;
      } else if (!newFont) {
        return char;
      }
    });

    await interaction.reply({
      content:
        (pingUser ? `${pingUser}` + " " : "") + convertedSentenceList.join(""),
    });
  },
};
