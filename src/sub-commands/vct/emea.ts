import { replyInfos } from "../../utils/vct/replyInfos.js";
export const subCommand = async (interaction) => {
  const team: string = interaction.options.get("team").value;
  const matchStatus: string = interaction.options.get("match-status").value;

  switch (team) {
    case "KC": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/8877/karmine-corp",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FNC": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2593/fnatic",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "VIT": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/2059/team-vitality",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/474/team-liquid",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "BBL": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/397/bbl-esports",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "TH": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1001/team-heretics-n",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "NAVI": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/4915/natus-vincere",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "KOI": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/7035/koi",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "FUT": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/1184/fut-esports",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "M8": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/12694/gentle-mates",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
    case "GX": {
      const replyObj: object = await replyInfos(
        "https://www.vlr.gg/team/14419/giantx",
        "emea",
        matchStatus
      );
      await interaction.reply(replyObj);
      break;
    }
  }
};
