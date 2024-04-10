import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;

  switch (team) {
    case "AG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1119/all-gamers",
        "americas"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "BLG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12010/bilibili-gaming",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "EDG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1120/edward-gaming",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FPX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11328/funplus-phoenix",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "JDG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/13576/jd-gaming",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "NOVA": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12064/nova-esports",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TEC": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/14137/titan-esports-club",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TE": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12685/trace-esports",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TYL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/731/tyloo",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "WOL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/13790/wolves-esports",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
    case "DRG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11981/dragon-ranger-gaming",
        "china"
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
