import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;
  const matchStatus: string = interaction.options.get("match-status").value;

  switch (team) {
    case "AG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1119/all-gamers",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "BLG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12010/bilibili-gaming",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "EDG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1120/edward-gaming",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FPX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11328/funplus-phoenix",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "JDG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/13576/jd-gaming",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "NOVA": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12064/nova-esports",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TEC": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/14137/titan-esports-club",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TE": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12685/trace-esports",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TYL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/731/tyloo",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "WOL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/13790/wolves-esports",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "DRG": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/11981/dragon-ranger-gaming",
        "china",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
